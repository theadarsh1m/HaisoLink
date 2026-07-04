# HaisoLink — System Design Write-Up

## 1. Rate Calculation Engine

HaisoLink employs a zone-based pricing model powered by the `PricingService`. When a customer submits an order, the engine resolves both the pickup and destination coordinates into their respective geographic **Areas** (via Nominatim reverse-geocoding), each of which belongs to a **Zone**. The system then queries the `RateCard` table for a matching entry keyed by `(sourceZoneId, destinationZoneId, orderType)`. This design supports differentiated intra-zone vs. inter-zone pricing for both B2B (STANDARD) and B2C (EXPRESS) shipments.

The billable weight is determined using the **volumetric weight formula**: `(Length × Width × Height) / 5000`, compared against the actual weight — whichever is greater becomes the billing basis. The final shipping charge is computed as `max(pricePerKg × billableWeight, minimumCharge)`, ensuring a floor rate. For Cash-on-Delivery orders, a configurable surcharge is fetched from the `CODCharge` table and appended. This layered approach — zone resolution → rate card lookup → volumetric comparison → surcharge addition — keeps pricing transparent and fully admin-configurable without code changes.

## 2. Zone Detection Approach

Geographic zone detection follows a hierarchical resolution strategy. Each **Area** record stores a `(latitude, longitude)` coordinate pair along with city, state, and pincode metadata, and is associated with exactly one **Zone**. When a new order provides pickup/drop coordinates, the system first attempts to find an existing Area within proximity. If none exists, it creates a new Area on-the-fly using Nominatim reverse-geocoding to extract the locality name, city, state, and pincode, then assigns it to a default zone (or the first available zone).

This architecture is designed to scale: administrators can pre-configure zones (e.g., "North Delhi", "South Delhi", "NCR Suburban") and map specific areas into them. The `Area` table serves as a growing geospatial registry — each new unique coordinate enriches the system's coverage without manual data entry. Zone boundaries are implicitly defined by which areas are assigned to them, giving admins full flexibility to reshape coverage by simply reassigning areas between zones via the admin panel.

## 3. Auto-Assignment Logic

The `AssignmentService` implements a weighted scoring algorithm to select the optimal delivery agent for each order. When `autoAssignAgent()` is triggered (either at order creation or upon rescheduling), it first queries for agents with `availabilityStatus = AVAILABLE` in the same zone as the pickup area. If no zone-local agents exist, it widens the search to all available agents system-wide.

Each candidate agent is scored using: `Score = (distance × 1.0) + (activeDeliveries × 10.0) − (averageRating × 1.0)`. Distance is calculated via the **Haversine formula** between the agent's last known GPS coordinates and the pickup location. The workload penalty (10× multiplier) strongly discourages overloading agents, while the rating bonus rewards consistently performing couriers. The agent with the **lowest score** wins the assignment. The system then atomically creates an `AgentAssignment` record, transitions the order to `ASSIGNED`, logs a tracking history entry, and sets the agent's status to `BUSY` — all within a single database transaction.

## 4. Failed Delivery Handling

Failed deliveries are managed through a structured lifecycle in `OrderLifecycleService`. When a delivery agent marks an order as failed (only permitted from the `OUT_FOR_DELIVERY` state), the system records a `DeliveryAttempt` with the attempt number, failure reason, and agent notes. The order transitions to `FAILED` status, and a tracking history entry is created.

The customer is immediately notified via the multi-channel `NotificationService` (Email, SMS, In-App) with the failure reason. On the customer dashboard, a "Reschedule Delivery" button appears, allowing the customer to select a new delivery date and provide a reason. Upon submission, the `rescheduleOrder()` method transitions the order to `RESCHEDULED`, creates a `RescheduleRequest` record for audit, and — crucially — immediately re-triggers `autoAssignAgent()` to place the order back into the dispatch pool. This ensures the rescheduled order gets a fresh agent assignment based on current availability, completing the recovery cycle without any manual admin intervention.

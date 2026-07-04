# HaisoLink - Last-Mile Logistics Management Platform

HaisoLink is an enterprise-grade, highly-scalable foundation for a last-mile delivery tracking platform. It is architected to handle the end-to-end logistics lifecycle—from customer order creation and automated pricing calculation to dynamic dispatching, live courier tracking, and robust proof-of-delivery workflows.

This codebase provides a production-ready foundation using TypeScript strict-mode typing, role-based access control (RBAC), standardized API models, and dedicated operational dashboards for three distinct user personas: Administrators, Delivery Agents, and Customers.

---

## Key Features

* **Dynamic Pricing Engine**: Automatically calculates shipping charges based on Volumetric vs. Actual weight comparisons, configurable Rate Cards (B2B/B2C, inter/intra zone), and COD surcharges.
* **Automated Dispatch & Assignment**: Dispatches are assigned to delivery agents via a comprehensive algorithm scoring their current proximity (Haversine distance), live workload, and agent rating.
* **Live Interactive Mapping**: Completely free and robust integration using **OpenStreetMap (OSRM)**, **React Leaflet**, and **Nominatim API** for precise geocoding, reverse-geocoding, and route mapping without Google Maps vendor lock-in.
* **Role-Based Portals**:
  * **Customer Portal**: Create orders, view active tracking timelines, and initiate reschedule workflows for failed deliveries.
  * **Agent Courier Hub**: Manage duty availability, view active dispatches, utilize live mapping, and advance order statuses to `DELIVERED` or `FAILED`.
  * **Admin Command Center**: Complete oversight of all orders, active agent fleet map, zone management, and manual override capabilities.
* **Real-time Event Tracking**: Centralized `OrderLifecycleService` logs every order timeline transition with timestamped histories and actor associations.
* **Robust Notification Hooks (Email/SMS/In-App)**: Dispatch event hooks fire automated customer updates on statuses such as `PICKED_UP`, `OUT_FOR_DELIVERY`, and `RESCHEDULED`.
* **Reschedule & Failure Recovery**: Failed deliveries allow customers to choose a new date, which automatically triggers re-entry into the algorithmic dispatch pool for reassignment.

---

## Tech Stack

HaisoLink uses the following framework integrations:

* **Core**: Next.js 15 (App Router), React 19, TypeScript
* **Styling**: Tailwind CSS v4.0, shadcn/ui custom primitives
* **Database & ORM**: PostgreSQL database, Prisma ORM
* **Authentication**: Better Auth (supporting Role-Based Access Control)
* **Mapping Engine**: Leaflet, React Leaflet, OpenStreetMap API, OSRM Routing
* **Form & Validation**: React Hook Form with Zod schema resolvers
* **State Management**: TanStack React Query v5

---

## Folder Structure

The project leverages a scalable layout with absolute paths mapping directly via the `src/` directory.

```
haisolink/
├── prisma/
│   └── schema.prisma        # Database models & role definitions for Better Auth
├── src/
│   ├── app/
│   │   ├── (auth)/          # Authentication routing layout
│   │   ├── admin/           # Admin control room (Statistics, Dispatches, Timelines, Zones)
│   │   ├── customer/        # Client panel (Package booking, Milestones tracking)
│   │   ├── agent/           # Fleet portal (Duty schedule, Live orders, Maps)
│   │   ├── api/             # API Routes for Logistics workflows, Pricing, and Auth
│   │   └── layout.tsx       # Root document layout with Theme & Query providers
│   ├── components/
│   │   ├── map/             # Leaflet & OpenStreetMap interactive components
│   │   ├── ui/              # Button, Input, Table, Card, Dialog, Badge, Skeletons
│   │   └── layouts/         # Shared Dashboard shell layouts
│   ├── lib/
│   │   ├── db.ts            # Global Prisma Client connection pool wrapper
│   │   ├── haversine.ts     # Geographic distance calculator
│   │   └── services/        # Third-party service wrappers (Geocoding, Routing)
│   ├── services/
│   │   ├── AssignmentService.ts      # Core algorithmic agent assignment engine
│   │   ├── OrderLifecycleService.ts  # Status transition guardrails & hooks
│   │   ├── PricingService.ts         # Live Volumetric & Rate Card math
│   │   └── NotificationService.ts    # Multi-channel notification dispatcher
│   ├── utils/
│   │   └── api-response.ts  # Standard {success, message, data, errors} JSON responders
│   └── validations/
│       └── workflow.ts      # Shared Zod schemas for system transitions
├── .env.example
├── tsconfig.json
├── components.json
└── package.json
```

---

## Environment Variables

All variables are listed in `.env.example`. Copy this to `.env` to override:

```bash
# Database Connection
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/haisolink?schema=public"

# Better Auth Configuration
BETTER_AUTH_SECRET="your-better-auth-secret-key-at-least-32-chars"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Note: HaisoLink runs completely free mapping via OpenStreetMap. 
# No API keys are required for Geocoding or Map integrations.
```

---

## Installation

To set up the repository locally, clone and execute:

```bash
# 1. Install dependencies
npm install

# 2. Set up local configurations
cp .env.example .env

# 3. Generate Prisma client typings
npx prisma generate

# 4. Sync Database schema
npx prisma db push
```

---

## Running Development Server

Start the local server with the Next.js Turbo compiler:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the welcome deck landing page.

*Note: For the Leaflet components to render properly without window errors, Next.js dynamic imports with `ssr: false` are utilized extensively across the codebase.*

---

## 🌐 Hosted Application

**Live URL**: [https://haisolink.netlify.app/](https://haisolink.netlify.app/)

---

## Demo Accounts

All demo accounts use the password: **`Password123!`**

| Role           | Email                  | Description             |
|----------------|------------------------|-------------------------|
| Customer       | `contact@techcorp.com` | TechCorp Inc. (B2B)     |
| Customer       | `jane@example.com`     | Jane Smith (Individual) |
| Delivery Agent | `john@haisolink.com`   | Motorcycle courier      |
| Delivery Agent | `mike@haisolink.com`   | Van courier             |
| Delivery Agent | `sarah@haisolink.com`  | Bicycle courier         |

---

## API Documentation

All API routes are under `/api/`. Authentication is handled via session cookies from Better Auth.

### Authentication
| Method | Endpoint               | Description              |
|--------|------------------------|--------------------------|
| POST   | `/api/auth/sign-up`    | Register a new user      |
| POST   | `/api/auth/sign-in`    | Login and create session |
| POST   | `/api/auth/sign-out`   | Destroy session          |

### Orders (Customer)
| Method | Endpoint                             | Description                                          |
|--------|--------------------------------------|------------------------------------------------------|
| GET    | `/api/orders`                        | Fetch all orders for the logged-in customer          |
| POST   | `/api/orders/create`                 | Create a new order with package + location details   |
| POST   | `/api/orders/calculate-price`        | Compute live pricing before order submission         |
| POST   | `/api/orders/[id]/reschedule`        | Reschedule a FAILED order with new date + reason     |

### Orders (Agent)
| Method | Endpoint                             | Description                                          |
|--------|--------------------------------------|------------------------------------------------------|
| GET    | `/api/agent/orders?active=true`      | Fetch active dispatches assigned to the agent        |
| PATCH  | `/api/orders/[id]/status`            | Transition order status (PICKED_UP, DELIVERED, etc.) |

### Orders (Admin)
| Method | Endpoint                             | Description                                          |
|--------|--------------------------------------|------------------------------------------------------|
| GET    | `/api/admin/orders`                  | Fetch all orders system-wide with filters            |
| GET    | `/api/admin/agents`                  | Fetch all delivery agents with profile data          |
| GET    | `/api/admin/zones`                   | Fetch all zones with areas                           |
| POST   | `/api/admin/zones`                   | Create a new zone                                    |
| POST   | `/api/admin/rate-cards`              | Create/update rate cards for zone pairs              |

### Agent Profile
| Method | Endpoint                             | Description                                          |
|--------|--------------------------------------|------------------------------------------------------|
| PATCH  | `/api/agent/availability`            | Toggle agent status (AVAILABLE/BUSY/OFFLINE/ON_LEAVE)|
| PATCH  | `/api/agent/location`                | Update agent GPS coordinates                         |

---

## Database Schema

The core data models and their relationships:

```
User (1) ──── (1) CustomerProfile ──── (*) Order
  │                                         │
  └──── (1) DeliveryAgentProfile ───────────┘ (assignedAgent)
              │
              └──── (*) AgentAssignment

Zone (1) ──── (*) Area ──── (*) Order (pickup/destination)
  │
  └──── (*) RateCard (source/dest zone pairs)

Order (1) ──── (*) TrackingHistory
  │
  ├──── (*) DeliveryAttempt
  ├──── (*) RescheduleRequest
  └──── (*) DeliveryProof

CODCharge ──── per OrderType surcharge config
```

### Key Models
- **User**: Central auth entity with `role` enum (ADMIN, DELIVERY_AGENT, CUSTOMER)
- **Zone**: Geographic grouping (e.g., "North Delhi", "South Delhi")
- **Area**: Specific locality with GPS coordinates, mapped to a Zone
- **RateCard**: Pricing rule per `(sourceZone, destZone, orderType)` pair
- **CODCharge**: Flat surcharge amount per OrderType for Cash-on-Delivery
- **Order**: Core entity with full lifecycle status tracking (CREATED → ASSIGNED → PICKED_UP → IN_TRANSIT → OUT_FOR_DELIVERY → DELIVERED/FAILED)
- **TrackingHistory**: Immutable audit log of every status transition with actor and timestamp

---

## Rate Calculation Logic

The pricing engine follows this pipeline:

```
1. RESOLVE AREAS
   Pickup/Destination coordinates → Nominatim reverse-geocode → Area records → Zone IDs

2. COMPUTE WEIGHT
   volumetricWeight = (Length × Width × Height) / 5000
   billableWeight   = max(actualWeight, volumetricWeight)

3. LOOKUP RATE CARD
   Query RateCard where sourceZoneId + destZoneId + orderType matches
   shippingCharge = max(pricePerKg × billableWeight, minimumCharge)

4. ADD COD SURCHARGE (if applicable)
   Query CODCharge for matching orderType
   totalCharge = shippingCharge + codSurcharge

5. RETURN BREAKDOWN
   { shippingCharge, CODCharge, totalCharge, billableWeight, volumetricWeight }
```

This is fully admin-configurable — rate cards and COD surcharges can be updated via the admin panel without any code changes.

---

## Verification Commands

```bash
# Verify ESLint configurations
npm run lint

# Type check
npx tsc --noEmit

# Compile and check production bundle builds
npm run build
```


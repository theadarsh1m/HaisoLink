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

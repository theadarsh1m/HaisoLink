# HaisoLink - Last-Mile Logistics Management Platform

HaisoLink is an enterprise-grade, highly-scalable foundation for a last-mile delivery tracking platform. It is architected to allow pluggable integrations of pricing calculations, agent scheduling engines, zone clustering algorithms, notifications, and real-time mapping.

This codebase sets up a clean, production-ready foundation using TypeScript strict-mode typing, role-based access control (RBAC), theme selection hooks, standardized API models, and visual placeholder dashboards for three distinct user personas: Administrators, Delivery Agents, and Customers.

---

## Tech Stack

HaisoLink uses the following framework integrations:

* **Core**: Next.js 15 (App Router), React 19, TypeScript
* **Styling**: Tailwind CSS v4.0, shadcn/ui custom primitives
* **Database & ORM**: PostgreSQL database target configuration, Prisma ORM
* **Authentication**: Better Auth (supporting Role-Based Access Control)
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
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   ├── admin/
│   │   │   └── dashboard/   # System control room (Statistics, Dispatches, Timelines)
│   │   ├── customer/
│   │   │   └── dashboard/   # Client panel (Package booking, Milestones tracking)
│   │   ├── agent/
│   │   │   └── dashboard/   # Fleet portal (Duty schedule, Availability toggle, Maps)
│   │   ├── api/
│   │   │   ├── auth/        # Better Auth endpoint handlers
│   │   │   └── v1/
│   │   │       └── health/  # API standard confirmation test route
│   │   ├── unauthorized/    # Access blocked fallback route
│   │   ├── not-found.tsx    # Custom 404 Route illustration
│   │   ├── error.tsx        # Custom Global Error Boundary
│   │   ├── layout.tsx       # Root document layout with Theme & Query providers
│   │   └── page.tsx         # Welcome Landing Page & test-routing deck
│   ├── components/
│   │   ├── ui/              # Button, Input, Table, Card, Dialog, Badge, Skeletons
│   │   ├── layouts/         # AuthCard and Collapsible Drawer Dashboard layouts
│   │   └── shared/          # Navbar, Sidebar, ThemeProvider, ThemeSwitcher toggles
│   ├── lib/
│   │   ├── db.ts            # Global Prisma Client connection pool wrapper
│   │   ├── auth.ts          # Server-side Better Auth setup
│   │   ├── auth-client.ts   # Client-side Better Auth session hook bindings
│   │   └── react-query.tsx  # TanStack QueryClient layout providers
│   ├── utils/
│   │   ├── format.ts        # Currency, DateTime, and Relative Time formatters
│   │   ├── api-response.ts  # Standard {success, message, data, errors} JSON responders
│   │   └── logger.ts        # Contextual dev console formatters & production JSON log output
│   ├── validations/
│   │   ├── auth.ts          # Auth forms validation schema
│   │   ├── order.ts         # Booking creation validation schema
│   │   ├── agent.ts         # Fleet details validation schema
│   │   └── admin.ts         # System settings validation schema
│   ├── middleware.ts        # Next.js session validation and RBAC routing filter
│   └── types/
│       └── index.ts         # Shared TypeScript entities (User, Session, Pagination, Filters)
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

# Email Provider Configuration
EMAIL_PROVIDER="resend"
EMAIL_API_KEY="re_your_api_key"

# Mapping & Geolocation APIs
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
NEXT_PUBLIC_MAP_PROVIDER="google" # 'google' or 'mapbox' or 'open-street-map'
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
```

---

## Running Development Server

Start the local server with the Next.js Turbo compiler:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the welcome deck landing page.

---

## Verification Commands

Validate compilation stability and coding style checks before deployment:

```bash
# Verify ESLint configurations
npm run lint

# Compile and check production bundle builds
npm run build
```

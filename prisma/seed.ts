import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { hashPassword } from "better-auth/crypto";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/haisolink?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

async function main() {
  await db.reschedule.deleteMany({});
  await db.agentAssignment.deleteMany({});
  await db.trackingHistory.deleteMany({});
  await db.order.deleteMany({});
  await db.notification.deleteMany({});
  await db.deliveryAgentProfile.deleteMany({});
  await db.customerProfile.deleteMany({});
  await db.account.deleteMany({});
  await db.session.deleteMany({});
  await db.user.deleteMany({});
  await db.area.deleteMany({});
  await db.rateCard.deleteMany({});
  await db.cODCharge.deleteMany({});
  await db.zone.deleteMany({});

  const demoPasswordHash = await hashPassword("password123");

  await db.user.create({
    data: {
      fullName: "System Admin",
      email: "admin@haisolink.com",
      role: "ADMIN",
      emailVerified: true,
      accounts: {
        create: {
          providerId: "credential",
          accountId: "admin@haisolink.com",
          password: demoPasswordHash,
        },
      },
    },
  });

  await db.user.create({
    data: {
      fullName: "Demo Customer",
      email: "customer@haisolink.com",
      role: "CUSTOMER",
      emailVerified: true,
      accounts: {
        create: {
          providerId: "credential",
          accountId: "customer@haisolink.com",
          password: demoPasswordHash,
        },
      },
      customerProfile: {
        create: {
          defaultAddress: "123 Demo St, Metro City",
        },
      },
    },
  });

  const northZone = await db.zone.create({
    data: { name: "North Zone", description: "North Logistics Region" },
  });
  const southZone = await db.zone.create({
    data: { name: "South Zone", description: "South Logistics Region" },
  });
  const eastZone = await db.zone.create({
    data: { name: "East Zone", description: "East Logistics Region" },
  });

  const areas = [
    { areaName: "Downtown", city: "Metro", state: "State A", pincode: "110001", latitude: 28.61, longitude: 77.20, zoneId: northZone.id },
    { areaName: "North Suburbs", city: "Metro", state: "State A", pincode: "110002", latitude: 28.65, longitude: 77.22, zoneId: northZone.id },
    { areaName: "University Area", city: "Metro", state: "State A", pincode: "110003", latitude: 28.69, longitude: 77.21, zoneId: northZone.id },
    { areaName: "Industrial Area North", city: "Metro", state: "State A", pincode: "110004", latitude: 28.72, longitude: 77.18, zoneId: northZone.id },

    { areaName: "South Center", city: "Metro", state: "State A", pincode: "110011", latitude: 28.52, longitude: 77.25, zoneId: southZone.id },
    { areaName: "South Suburbs", city: "Metro", state: "State A", pincode: "110012", latitude: 28.48, longitude: 77.29, zoneId: southZone.id },
    { areaName: "Airport Area", city: "Metro", state: "State A", pincode: "110013", latitude: 28.56, longitude: 77.10, zoneId: southZone.id },
    { areaName: "Tech Park", city: "Metro", state: "State A", pincode: "110014", latitude: 28.44, longitude: 77.31, zoneId: southZone.id },

    { areaName: "East Gate", city: "Metro", state: "State A", pincode: "110021", latitude: 28.62, longitude: 77.35, zoneId: eastZone.id },
    { areaName: "East Suburbs", city: "Metro", state: "State A", pincode: "110022", latitude: 28.64, longitude: 77.38, zoneId: eastZone.id },
    { areaName: "River Front", city: "Metro", state: "State A", pincode: "110023", latitude: 28.59, longitude: 77.33, zoneId: eastZone.id },
    { areaName: "Industrial Area East", city: "Metro", state: "State A", pincode: "110024", latitude: 28.67, longitude: 77.41, zoneId: eastZone.id },
  ];

  for (const area of areas) {
    await db.area.create({ data: area });
  }

  const agentsData = [
    { name: "Demo Agent", email: "agent@haisolink.com", vehicle: "MOTORCYCLE", license: "DL-1M-1234", zoneId: northZone.id },
    { name: "Jane Smith", email: "jane@example.com", vehicle: "CAR", license: "DL-2C-5678", zoneId: northZone.id },
    { name: "Bob Johnson", email: "bob@example.com", vehicle: "VAN", license: "DL-3V-9012", zoneId: southZone.id },
    { name: "Alice Williams", email: "alice@example.com", vehicle: "MOTORCYCLE", license: "DL-4M-3456", zoneId: southZone.id },
    { name: "Charlie Brown", email: "charlie@example.com", vehicle: "VAN", license: "DL-5V-7890", zoneId: eastZone.id },
  ];

  for (const agent of agentsData) {
    await db.user.create({
      data: {
        fullName: agent.name,
        email: agent.email,
        role: "DELIVERY_AGENT",
        emailVerified: true,
        accounts: {
          create: {
            providerId: "credential",
            accountId: agent.email,
            password: demoPasswordHash,
          },
        },
        deliveryAgentProfile: {
          create: {
            vehicleType: agent.vehicle,
            licenseNumber: agent.license,
            availabilityStatus: "AVAILABLE",
            zoneId: agent.zoneId,
          },
        },
      },
    });
  }

  const zones = [northZone, southZone, eastZone];
  for (const source of zones) {
    for (const destination of zones) {
      const isIntra = source.id === destination.id;

      await db.rateCard.create({
        data: {
          sourceZoneId: source.id,
          destinationZoneId: destination.id,
          orderType: "B2B",
          pricePerKg: isIntra ? 2.5 : 5.0,
          minimumCharge: isIntra ? 10.0 : 25.0,
        },
      });

      await db.rateCard.create({
        data: {
          sourceZoneId: source.id,
          destinationZoneId: destination.id,
          orderType: "B2C",
          pricePerKg: isIntra ? 5.0 : 10.0,
          minimumCharge: isIntra ? 20.0 : 50.0,
        },
      });
    }
  }

  await db.cODCharge.create({
    data: {
      orderType: "B2B",
      surchargeAmount: 2.0,
    },
  });

  await db.cODCharge.create({
    data: {
      orderType: "B2C",
      surchargeAmount: 5.0,
    },
  });
}

main()
  .then(async () => {
    await db.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    await pool.end();
    process.exit(1);
  });

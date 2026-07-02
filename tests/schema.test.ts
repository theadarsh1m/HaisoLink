import { db } from "../src/lib/db";

async function testSchema() {
  try {
    if (!db.user) {
      throw new Error("User model is missing from Prisma Client");
    }
    if (!db.zone) {
      throw new Error("Zone model is missing from Prisma Client");
    }
    if (!db.order) {
      throw new Error("Order model is missing from Prisma Client");
    }
    console.log("Prisma client schemas verified successfully");
  } catch (error) {
    console.error("Prisma Client Schema check failed:", error);
    process.exit(1);
  }
}

testSchema();

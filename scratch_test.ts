import { PricingService } from "./src/services/PricingService";
import { db } from "./src/lib/db";

async function test() {
  const p = new PricingService();
  const existingAreas = await db.area.findMany({
    where: { zone: { name: { not: "Default Region" } } }
  });
  
  if (existingAreas.length < 2) {
    console.log("Not enough areas");
    return;
  }
  
  console.log("Areas:", existingAreas[0].zoneId, "and", existingAreas[1].zoneId);

  try {
    const res = await p.calculatePrice(
      existingAreas[0].id, 
      existingAreas[1].id, 
      "STANDARD", 
      "PREPAID", 
      20, 20, 20, 10
    );
    console.log("Success:", res);
  } catch (e) {
    console.error("Failed:", e);
  }
}

test().finally(() => db.$disconnect());

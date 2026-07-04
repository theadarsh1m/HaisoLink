import { db } from "./src/lib/db";

async function main() {
  const count = await db.rateCard.count();
  console.log("Total RateCards:", count);
  const areas = await db.area.count();
  console.log("Total Areas:", areas);
  const rateCards = await db.rateCard.findMany({ take: 5 });
  console.log(rateCards);
}
main().finally(() => db.$disconnect());

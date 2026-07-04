import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const rateCards = await db.rateCard.findMany({ include: { sourceZone: true, destinationZone: true } });
  const areas = await db.area.findMany({ include: { zone: true } });
  
  return NextResponse.json({
    rateCards,
    areas,
  });
}

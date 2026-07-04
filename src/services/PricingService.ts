import { db } from "@/lib/db";
import { OrderType, PaymentType } from "@prisma/client";

export class PricingService {
  async calculatePrice(
    pickupAreaId: string,
    destinationAreaId: string,
    orderType: OrderType,
    paymentType: PaymentType,
    length: number,
    width: number,
    height: number,
    actualWeight: number
  ) {
    // 1. Resolve Areas to Zones
    const pickupArea = await db.area.findUnique({
      where: { id: pickupAreaId },
      include: { zone: true },
    });

    const destinationArea = await db.area.findUnique({
      where: { id: destinationAreaId },
      include: { zone: true },
    });

    if (!pickupArea || !destinationArea) {
      throw new Error("Invalid pickup or destination area");
    }

    // 2. Fetch Rate Card
    const rateCardQuery = {
      sourceZoneId: pickupArea.zoneId,
      destinationZoneId: destinationArea.zoneId,
      orderType: orderType,
      isActive: true,
    };
    console.log("[PricingService] Querying RateCard with:", rateCardQuery);
    
    const rateCard = await db.rateCard.findFirst({
      where: rateCardQuery,
    });

    if (!rateCard) {
      console.error("[PricingService] RateCard not found for query:", rateCardQuery);
      throw new Error("No rate card available for this route and order type");
    }

    // 3. Calculate Weights
    // Volumetric weight divisor typically 5000 in logistics
    const volumetricWeight = (length * width * height) / 5000;
    const billableWeight = Math.max(actualWeight, volumetricWeight);

    // 4. Calculate Base Shipping
    let shippingCharge = billableWeight * rateCard.pricePerKg;
    if (shippingCharge < rateCard.minimumCharge) {
      shippingCharge = rateCard.minimumCharge;
    }

    // 5. Calculate Surcharges (COD)
    let CODCharge = 0;
    if (paymentType === "COD") {
      const codSetting = await db.cODCharge.findFirst({
        where: { orderType },
      });
      if (codSetting) {
        CODCharge = codSetting.surchargeAmount;
      } else {
        // Fallback default
        CODCharge = 2.0;
      }
    }

    const totalCharge = shippingCharge + CODCharge;

    return {
      shippingCharge: parseFloat(shippingCharge.toFixed(2)),
      CODCharge: parseFloat(CODCharge.toFixed(2)),
      totalCharge: parseFloat(totalCharge.toFixed(2)),
      billableWeight: parseFloat(billableWeight.toFixed(2)),
      volumetricWeight: parseFloat(volumetricWeight.toFixed(2)),
    };
  }
}

import { z } from "zod";

export const codChargeSchema = z.object({
  orderType: z.enum(["STANDARD", "EXPRESS"], {
    message: "Order type must be STANDARD or EXPRESS",
  }),
  surchargeAmount: z.number().nonnegative({ message: "Surcharge amount cannot be negative" }),
});

export type CODChargeInput = z.infer<typeof codChargeSchema>;

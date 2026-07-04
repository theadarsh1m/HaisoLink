import { z } from "zod";

export const codChargeSchema = z.object({
  orderType: z.enum(["B2B", "B2C"], {
    message: "Order type must be B2B or B2C",
  }),
  surchargeAmount: z.number().nonnegative({ message: "Surcharge amount cannot be negative" }),
});

export type CODChargeInput = z.infer<typeof codChargeSchema>;

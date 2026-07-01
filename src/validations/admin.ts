import { z } from "zod";

export const adminSettingsSchema = z.object({
  baseDeliveryFee: z.number().nonnegative({ message: "Fee cannot be negative" }),
  pricePerKm: z.number().nonnegative({ message: "Price per km cannot be negative" }),
  maxWeightLimit: z.number().positive({ message: "Weight limit must be positive" }),
  allowAutoAssignment: z.boolean().default(true),
  systemEmailSender: z.string().email({ message: "Must be a valid sender email" }),
});

export type AdminSettingsInput = z.infer<typeof adminSettingsSchema>;

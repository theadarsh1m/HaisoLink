import { z } from "zod";

export const rateCardSchema = z.object({
  sourceZoneId: z.string().uuid({ message: "Source zone ID must be a valid UUID" }),
  destinationZoneId: z.string().uuid({ message: "Destination zone ID must be a valid UUID" }),
  orderType: z.enum(["STANDARD", "EXPRESS"], {
    message: "Order type must be STANDARD or EXPRESS",
  }),
  pricePerKg: z.number().positive({ message: "Price per kg must be a positive number" }),
  minimumCharge: z.number().positive({ message: "Minimum charge must be a positive number" }),
  isActive: z.boolean().default(true),
});

export type RateCardInput = z.infer<typeof rateCardSchema>;

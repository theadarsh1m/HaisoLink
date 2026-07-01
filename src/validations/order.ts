import { z } from "zod";

export const orderSchema = z.object({
  recipientName: z.string().min(2, { message: "Recipient name must be at least 2 characters" }),
  recipientEmail: z.string().email({ message: "Invalid recipient email" }),
  recipientPhone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),

  pickupAddress: z.string().min(5, { message: "Pickup address is required (min 5 chars)" }),
  deliveryAddress: z.string().min(5, { message: "Delivery address is required (min 5 chars)" }),

  weight: z.number().positive({ message: "Weight must be a positive number" }).default(1),
  dimensions: z.string().optional(),

  notes: z.string().max(300, { message: "Notes cannot exceed 300 characters" }).optional(),
});

export type OrderInput = z.infer<typeof orderSchema>;

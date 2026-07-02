import { z } from "zod";

export const statusUpdateSchema = z.object({
  status: z.enum([
    "CREATED",
    "ASSIGNED",
    "PICKED_UP",
    "IN_TRANSIT",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "FAILED",
    "RESCHEDULED",
    "CANCELLED",
  ], {
    message: "Invalid status option",
  }),
  remarks: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const deliveryProofSchema = z.object({
  recipientName: z.string().min(2, { message: "Recipient name is required" }),
  otp: z.string().optional(),
  signaturePath: z.string().optional(),
  photoUrl: z.string().optional(),
  notes: z.string().optional(),
});

export const failedDeliverySchema = z.object({
  reason: z.enum([
    "Customer Not Available",
    "Wrong Address",
    "Customer Refused",
    "Weather",
    "Vehicle Issue",
    "Other",
  ], {
    message: "Invalid failure reason option",
  }),
  notes: z.string().optional(),
});

export const rescheduleSchema = z.object({
  requestedDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid requested date format",
  }),
  reason: z.string().min(3, { message: "Reschedule reason is required" }),
});

export const timelineFiltersSchema = z.object({
  actor: z.string().optional(),
});

export type StatusUpdateInput = z.infer<typeof statusUpdateSchema>;
export type DeliveryProofInput = z.infer<typeof deliveryProofSchema>;
export type FailedDeliveryInput = z.infer<typeof failedDeliverySchema>;
export type RescheduleInput = z.infer<typeof rescheduleSchema>;
export type TimelineFiltersInput = z.infer<typeof timelineFiltersSchema>;

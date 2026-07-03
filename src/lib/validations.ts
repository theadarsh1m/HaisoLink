import { z } from "zod";

export const CreateOrderSchema = z.object({
  customerId: z.string().uuid(),
  orderType: z.enum(["STANDARD", "EXPRESS"]),
  paymentType: z.enum(["PREPAID", "COD"]),
  pickupAreaId: z.string().uuid(),
  destinationAreaId: z.string().uuid(),
  packageWeight: z.number().positive("Weight must be positive"),
  packageLength: z.number().positive(),
  packageWidth: z.number().positive(),
  packageHeight: z.number().positive(),
  declaredValue: z.number().min(0).optional(),
});

export const UpdateOrderStatusSchema = z.object({
  status: z.enum(["ASSIGNED", "PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED", "FAILED"]),
  remarks: z.string().optional(),
  location: z.string().optional(),
});

export const AssignAgentSchema = z.object({
  agentId: z.string().uuid(),
});

export const UpdateAgentLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

import { z } from "zod";

export const agentSchema = z.object({
  vehicleType: z.enum(["BICYCLE", "MOTORCYCLE", "CAR", "VAN", "TRUCK"], {
    message: "Please select a valid vehicle type",
  }),
  licensePlate: z.string().min(3, { message: "License plate is required" }),
  isAvailable: z.boolean().default(true),
  currentZone: z.string().optional(),
});

export type AgentInput = z.infer<typeof agentSchema>;

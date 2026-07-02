import { z } from "zod";

export const agentSchema = z.object({
  vehicleType: z.string().min(2, { message: "Vehicle type is required" }),
  licenseNumber: z.string().min(3, { message: "License number is required" }),
  currentLatitude: z.number().optional().nullable(),
  currentLongitude: z.number().optional().nullable(),
  availabilityStatus: z.enum(["AVAILABLE", "BUSY", "OFFLINE", "ON_LEAVE"], {
    message: "Availability status must be AVAILABLE, BUSY, OFFLINE, or ON_LEAVE",
  }),
  zoneId: z.string().uuid({ message: "Zone ID must be a valid UUID" }).optional().nullable(),
});

export const locationUpdateSchema = z.object({
  latitude: z.number({ message: "Latitude must be a valid number" }),
  longitude: z.number({ message: "Longitude must be a valid number" }),
});

export const availabilityUpdateSchema = z.object({
  status: z.enum(["AVAILABLE", "BUSY", "OFFLINE", "ON_LEAVE"], {
    message: "Availability status must be AVAILABLE, BUSY, OFFLINE, or ON_LEAVE",
  }),
});

export type AgentInput = z.infer<typeof agentSchema>;
export type LocationUpdateInput = z.infer<typeof locationUpdateSchema>;
export type AvailabilityUpdateInput = z.infer<typeof availabilityUpdateSchema>;

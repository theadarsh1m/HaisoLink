import { z } from "zod";

export const areaSchema = z.object({
  areaName: z.string().min(2, { message: "Area name must be at least 2 characters" }),
  city: z.string().min(2, { message: "City name must be at least 2 characters" }),
  state: z.string().min(2, { message: "State name must be at least 2 characters" }),
  pincode: z.string().length(6, { message: "Pincode must be exactly 6 digits" }),
  latitude: z.number({ message: "Latitude is required" }),
  longitude: z.number({ message: "Longitude is required" }),
  zoneId: z.string().uuid({ message: "Zone ID must be a valid UUID" }),
});

export type AreaInput = z.infer<typeof areaSchema>;

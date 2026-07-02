import { z } from "zod";

export const zoneSchema = z.object({
  name: z.string().min(2, { message: "Zone name must be at least 2 characters" }),
  description: z.string().optional().nullable(),
});

export type ZoneInput = z.infer<typeof zoneSchema>;

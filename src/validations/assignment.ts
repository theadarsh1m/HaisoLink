import { z } from "zod";

export const manualAssignmentSchema = z.object({
  agentId: z.string().uuid({ message: "Agent ID must be a valid UUID" }),
});

export type ManualAssignmentInput = z.infer<typeof manualAssignmentSchema>;

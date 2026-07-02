import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { successResponse, errorResponse } from "@/utils/api-response";
import { AssignmentService } from "@/services/AssignmentService";
import { manualAssignmentSchema } from "@/validations/assignment";

export const dynamic = "force-dynamic";

const assignmentService = new AssignmentService();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: request.headers });
    const body = await request.json();

    const result = manualAssignmentSchema.safeParse(body);
    if (!result.success) {
      return errorResponse("Invalid input parameters", result.error.format(), 400);
    }

    const { agentId } = result.data;
    const dispatcherId = session?.user?.id || "SYSTEM";

    await assignmentService.manualAssignAgent(id, agentId, dispatcherId);
    return successResponse({}, "Agent assigned manually successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to assign agent manually";
    return errorResponse(message, null, 500);
  }
}

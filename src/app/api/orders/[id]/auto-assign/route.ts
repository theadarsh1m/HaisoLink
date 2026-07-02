import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/utils/api-response";
import { AssignmentService } from "@/services/AssignmentService";

export const dynamic = "force-dynamic";

const assignmentService = new AssignmentService();

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const agentId = await assignmentService.autoAssignAgent(id);
    return successResponse({ agentId }, "Agent auto-assigned successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to auto-assign agent";
    return errorResponse(message, null, 500);
  }
}

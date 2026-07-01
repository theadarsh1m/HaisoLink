import { successResponse } from "@/utils/api-response";

export async function GET() {
  return successResponse(
    {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    },
    "HaisoLink System Health API is operational"
  );
}

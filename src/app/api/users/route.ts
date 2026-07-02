import { NextRequest } from "next/server";
import { successResponse } from "@/utils/api-response";

export async function GET() {
  return successResponse(
    [
      {
        id: "usr-uuid-1",
        fullName: "Jane Doe",
        email: "jane@example.com",
        role: "CUSTOMER",
      },
    ],
    "Users retrieved successfully"
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return successResponse(
      {
        id: "usr-uuid-2",
        ...body,
      },
      "User created successfully",
      201
    );
  } catch {
    return successResponse({}, "User created successfully", 201);
  }
}

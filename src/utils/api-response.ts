import { NextResponse } from "next/server";

export interface ApiResponsePayload<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  errors: unknown;
}

export function successResponse<T>(
  data: T,
  message = "Operation successful",
  status = 200
): NextResponse<ApiResponsePayload<T>> {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      errors: null,
    },
    { status }
  );
}

export function errorResponse(
  message = "Operation failed",
  errors: unknown = null,
  status = 400
): NextResponse<ApiResponsePayload<null>> {
  return NextResponse.json(
    {
      success: false,
      message,
      data: null,
      errors,
    },
    { status }
  );
}

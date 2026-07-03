export class APIError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends APIError {
  constructor(message: string = "Validation Failed") {
    super(message, 400);
  }
}

export class AuthenticationError extends APIError {
  constructor(message: string = "Authentication Required") {
    super(message, 401);
  }
}

export class AuthorizationError extends APIError {
  constructor(message: string = "Permission Denied") {
    super(message, 403);
  }
}

export class NotFoundError extends APIError {
  constructor(message: string = "Resource Not Found") {
    super(message, 404);
  }
}

export class BusinessLogicError extends APIError {
  constructor(message: string = "Unprocessable Entity") {
    super(message, 422);
  }
}

export class RateLimitError extends APIError {
  constructor(message: string = "Too Many Requests") {
    super(message, 429);
  }
}

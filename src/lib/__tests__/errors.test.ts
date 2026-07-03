import { describe, it, expect } from 'vitest';
import { ValidationError, AuthenticationError, NotFoundError } from '../errors';

describe('Custom Errors', () => {
  it('ValidationError should have statusCode 400', () => {
    const error = new ValidationError();
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe("Validation Failed");
  });

  it('AuthenticationError should have statusCode 401', () => {
    const error = new AuthenticationError("Custom auth message");
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe("Custom auth message");
  });

  it('NotFoundError should have statusCode 404', () => {
    const error = new NotFoundError();
    expect(error.statusCode).toBe(404);
  });
});

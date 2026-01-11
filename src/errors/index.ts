export class MetiganError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MetiganError';
  }
}

export class ApiError extends MetiganError {
  constructor(
    public statusCode: number,
    public message: string,
    public error?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends MetiganError {
  constructor(public message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}


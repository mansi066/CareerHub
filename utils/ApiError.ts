class ApiError extends Error {
    statusCode: number;
    success: false;
    errors: unknown[];
    data: unknown;

    constructor(
        statusCode: number,
        message: string = "Something went wrong",
        errors: unknown[] = [],
        stack?: string
    ) {
        super(message);
        this.name = "ApiError";
        this.statusCode = statusCode;
        this.data = null;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }

        Object.setPrototypeOf(this, new.target.prototype); // ensure instanceof works
    }
}

export { ApiError };
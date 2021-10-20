import { ValidationError } from "express-validator";
import { CustomError } from "./CustomError";

export class RequestValidationError extends CustomError {
    statusCode = 400;
    serializeError() {
        return this.errors.map(err => ({ message: err.msg, field: err.param }));
    }

    constructor(public errors: ValidationError[]) {
        super('Invalid request parameters');
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
}
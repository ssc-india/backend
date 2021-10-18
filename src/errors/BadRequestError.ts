import { CustomError } from "./CustomError";

export class BadRequestError extends CustomError {
    statusCode = 400;
    serializeError() {
        return [{ message: this.message }];
    }

    constructor(public message: string) {
        super(message);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}
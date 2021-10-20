import { CustomError } from "./CustomError";

export class ForbiddenError extends CustomError {
    statusCode = 403;
    serializeError() {
        return [{ message: this.message }];
    }

    constructor(public message: string) {
        super(message);
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}

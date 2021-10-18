import { CustomError } from "./CustomError";

export class NotFoundError extends CustomError {
    statusCode = 404;
    serializeError() {
        return [{ message: 'Not Found' }];
    }

    constructor() {
        super('Route not Found');
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}
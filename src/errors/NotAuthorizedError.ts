import { CustomError } from "./CustomError";

export class NotAuthorizedError extends CustomError {
    statusCode = 401;
    serializeError() {
        return [{ message: 'You need to sign in first' }];
    }

    constructor() {
        super('Not Authorized');
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }
}

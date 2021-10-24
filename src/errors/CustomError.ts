import { ErrorType } from './errorType';

export abstract class CustomError extends Error {
    abstract statusCode: number;
    abstract serializeError(): ErrorType[];

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}

import { CustomError } from "./CustomError";

export class DatabaseConnectionError extends CustomError {
    statusCode = 500;
    serializeError() {
        return [{ message: 'Error connecting to database' }];
    }

    constructor() {
        super('Error connecting to db');
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }
}
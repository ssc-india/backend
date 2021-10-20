import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/CustomError';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof CustomError) {
        const errors = err.serializeError();
        return res.status(err.statusCode).send({ errors });
    }
    
    console.error('Something went wrong', err);
    res.status(400).send({
        errors: [{ message: 'Something went wrong' }]
    });
}

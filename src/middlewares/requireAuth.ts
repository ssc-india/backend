import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors/NotAuthorizedError';

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session?.jwt) {
        throw new NotAuthorizedError();
    }

    next();
}

export { requireAuth }

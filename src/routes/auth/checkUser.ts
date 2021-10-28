import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { UserInfo } from '../../types';

const router = Router();

router.get('/auth/check_user', async (req: Request, res: Response) => {
    let currentUser: UserInfo | null = null;

    if (req.session?.jwt) {
        try {
            currentUser = jwt.verify(req.session?.jwt, process.env.JWT_KEY!) as UserInfo;
        } catch (err) {
            throw new Error('JWT Verify Error');
        }
    }

    res.status(200).send({ currentUser });
});

export { router as checkUserRouter }

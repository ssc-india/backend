import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest } from '../../middlewares';
import { BadRequestError } from '../../errors';
import { User } from '../../models';
import { Password } from '../../services';
import { UserInfo } from '../../types';
const router = Router();

router.post('/auth/signin', [
    body('identity')
        .not()
        .isEmpty()
        .withMessage('Please provide a valid email or username'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password ust be at least 8 characters long')
],
validateRequest,
async (req: Request, res: Response) => {
    const { identity, password } = req.body;

    const existingUser = await User.findOne({ $or: [ { email: identity }, { username: identity } ] });
    if (!existingUser) {
        throw new BadRequestError('Invalid Credentials');
    }

    const passwordsMatch = await Password.compare(existingUser.get('password'), password);
    if (!passwordsMatch) {
        throw new BadRequestError('Invalid Credentials');
    }
    
    const userInfo: UserInfo = {
        email: existingUser.email,
        username: existingUser.username,
        isVerified: existingUser.isVerified
    }

    const userJwt = jwt.sign(userInfo, process.env.JWT_KEY!);

    req.session = {
        jwt: userJwt
    }

    res.status(200).send(existingUser);
});

export { router as signinRouter }

import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../../middlewares/validateRequest';
import { BadRequestError } from '../../errors/BadRequestError';
import { User } from '../../models/User';
import { Password } from '../../services/Password';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/auth/signin', [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password ust be at least 8 characters long')
],
validateRequest,
async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        throw new BadRequestError('Invalid Credentials');
    }

    const passwordsMatch = await Password.compare(existingUser.get('password'), password);
    if (!passwordsMatch) {
        throw new BadRequestError('Invalid Credentials');
    }

    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
    }, process.env.JWT_KEY!);

    req.session = {
        jwt: userJwt
    }

    res.status(200).send(existingUser);
});

export { router as signinRouter }

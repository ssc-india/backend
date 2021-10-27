import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../../errors';
import { validateRequest } from '../../middlewares';
import { User, UserType, PendingVerification } from '../../models';
import { transporter } from '../../services';
import { getEmailTemplate } from '../../templates';

const router = Router();

router.post('/auth/signup', [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .trim()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    body('username')
        .not()
        .isEmpty()
        .withMessage('Please provide a username'),
    body('institute')
        .not()
        .isEmpty()
        .withMessage('Please provide the institute you are studying in'),
    body('branch')
        .not()
        .isEmpty()
        .withMessage('Please provide the branch you are enrolled in')
],
validateRequest,
async (req: Request, res: Response) => {
    const { name, username, institute, branch, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new BadRequestError('Email already in use!');
    }

    const user = User.build({
        name,
        username,
        institute,
        branch,
        email,
        password,
        type: UserType.REGULAR,
        isVerified: false
    });

    await user.save();

    const verificationEntry = PendingVerification.build({ userId: user.get('_id'), timestamp: new Date() });
    await verificationEntry.save();

    transporter.sendMail({
        from: `"Science Students Collective India" <scistudentscollectiveindia@gmail.com>`,
        to: email,
        subject: 'Verify your email',
        html: getEmailTemplate(name, verificationEntry.get('_id'))
    });
    
    res.status(201).send(user);
});

export {router as signupRouter}

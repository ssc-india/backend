import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../../errors/BadRequestError';
import { validateRequest } from '../../middlewares/validateRequest';
import { User, UserType } from '../../models/User';
import { PendingVerification } from '../../models/PendingVerification';
import { transporter } from '../../services/EmailTransporter';
import { getEmailTemplate } from '../../templates/EmailVerification';

const router = Router();

router.post('/auth/signup', [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .trim()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
],
validateRequest,
async (req: Request, res: Response) => {
    const { name, institute, branch, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new BadRequestError('Email already in use!');
    }

    const user = User.build({ name, institute, branch, email, password, type: UserType.REGULAR, isVerified: false });
    await user.save();

    const verificationEntry = PendingVerification.build({ userId: user.get('_id'), timestamp: new Date() });
    await verificationEntry.save();

    transporter.sendMail({
        from: `"Science Students Collective India" <scistudentscollectiveindia@gmail.com>`,
        to: email,
        subject: 'Email Verification',
        html: getEmailTemplate(name)
    });
    
    const userJwt = jwt.sign({
        id: user.id,
        email: user.email
    }, process.env.JWT_KEY!);

    req.session = {
        jwt: userJwt
    }

    res.status(201).send(user);
});

export {router as signupRouter}

import { Router, Request, Response } from 'express';
import { User, PendingVerification } from '../../models';
import { ForbiddenError, BadRequestError } from '../../errors';

const VERIFICATION_EXPIRATION_MILLISECONDS = 24 * 60 * 60 * 1000; // Verification link expiration time

const router = Router();

// route for verifying email addresses on user registration
router.post('/auth/verify_email', async (req: Request, res: Response) => {
    // get the verificationId from the request body
    const { id } = req.body;

    // get the pending verification entry from the database. Throw an error if no entry is found
    const verificationEntry = await PendingVerification.findById(id);
    if (!verificationEntry) {
        throw new BadRequestError('Invalid verification link')
    }

    // check if the link has expired. If so throw an error
    const registrationTime = verificationEntry.get('timestamp');
    if ((new Date()).getTime() - registrationTime.getTime() > VERIFICATION_EXPIRATION_MILLISECONDS) {
        throw new ForbiddenError('The verification link has expired');
    }

    // check if the userId in the verification entry is valid and update it if so
    // else throw an error
    const userId = verificationEntry.get('userId');
    const user = await User.findById(userId);
    if (!user) {
        throw new BadRequestError('Invalid user');
    }
    user.isVerified = true;
    await user.save();

    // delete the verification entry
    try {
        await PendingVerification.findByIdAndDelete(id);
    } catch (err) {
        throw new Error(`Error deleting verification entry: ${err}`);
    }

    // send success status if all checks pass
    res.status(200).send();
});

export { router as verifyEmailRouter }

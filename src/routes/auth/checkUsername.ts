import { Router, Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest } from '../../middlewares/validateRequest';
import { User } from '../../models/User';
import { BadRequestError } from '../../errors/BadRequestError';

const router = Router();

// route for checking if the given username already exists
router.post('/auth/check_username', [
    body('username')
        .not()
        .isEmpty()
        .withMessage('Please provide a username')
],
validateRequest,
async (req: Request, res: Response) => {
    const { username } = req.body;

    // look for a user with the given username. If found, throw an error
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        throw new BadRequestError('Username already taken');
    }

    // If no such user exists, the username is valid
    res.status(200).send();
});

export { router as checkUsernameRouter }

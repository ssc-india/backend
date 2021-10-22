import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import { validateRequest } from '../../middlewares/validateRequest';
import { requireAuth } from '../../middlewares/requireAuth';
import { Content } from '../../models/Content';
import { User, UserType } from '../../models/User';
import { BadRequestError } from '../../errors/BadRequestError';
import { ForbiddenError } from '../../errors/ForbiddenError';

const router = Router();

interface UserInfo {
    email: string;
}

router.post('/content/delete', requireAuth, [
    body('postId')
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('Please provide a valid Post ID'),
],
validateRequest,
async (req: Request, res: Response) => {
    const { postId } = req.body; 
    const userInfo = jwt.verify(req.session?.jwt, process.env.JWT_KEY!) as UserInfo;
    const user = await User.findOne({ email: userInfo.email });
    if (!user) {
        throw new BadRequestError('Invalid user');
    } else {
        const content = await Content.findById(postId).populate('author');
        if (!content) {
            throw new BadRequestError('Content not found');
        }

        if (content.get('author').email === user.get('email') || user.get('type') === UserType.MODERATOR) {
            try {
                const deletedContent = Content.findByIdAndDelete(postId);
                res.status(200).send(deletedContent);
            } catch (err) {
                throw new BadRequestError('Requested content not found');
            }
        } else {
            throw new ForbiddenError('Only the author or a moderator can perform this action');
        }
    }
});

export { router as contentDeleteRouter }

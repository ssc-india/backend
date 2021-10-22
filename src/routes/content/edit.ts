import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import { validateRequest } from '../../middlewares/validateRequest';
import { requireAuth } from '../../middlewares/requireAuth';
import { Content, ContentType } from '../../models/Content';
import { User } from '../../models/User';
import { BadRequestError } from '../../errors/BadRequestError';
import { ForbiddenError } from '../../errors/ForbiddenError';
const router = Router();

interface UserInfo {
    email: string;
}

router.post('/content/edit', requireAuth, [
    body('postId')
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('Please provide a valid Post ID'),
    body('content')
        .not()
        .isEmpty()
        .withMessage('Please provide updated content')
],
validateRequest,
async (req: Request, res: Response) => {
    const { postId } = req.body; 
    const content = req.body.content as ContentType[];
    const userInfo = jwt.verify(req.session?.jwt, process.env.JWT_KEY!) as UserInfo;
    const user = await User.findOne({ email: userInfo.email });
    if (!user) {
        throw new BadRequestError('Invalid user')
    } else {
        const OldContent = await Content.findById(postId).populate('author');
        if (!OldContent) {
            throw new BadRequestError('Content not found');
        }

        if (OldContent.get('author').email === user.get('email')) {
            try {
                const updatedContent = await Content.findByIdAndUpdate(postId, { content });
                res.status(200).send(updatedContent);
            } catch (err) {
                throw new BadRequestError('Requested content not found');
            }
        } else {
            throw new ForbiddenError('Only the author of the post can perform this action');
        }
    }
});

export { router as contentEditRouter }

import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import { requireAuth, validateRequest } from '../../middlewares';
import { User, Content, ContentType } from '../../models';
import { ForbiddenError, BadRequestError } from '../../errors';

const router = Router();

interface UserInfo {
    email: string;
}

router.post('/content/edit', requireAuth, [
    body('postId')
        .not()
        .isEmpty()
        .withMessage('Please provide a valid Post ID')
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('Post ID is invalid'),
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
        const oldContent = await Content.findById(postId).populate('author');
        if (!oldContent) {
            throw new BadRequestError('Content not found');
        }

        if (oldContent.get('author').email === user.get('email')) {
           oldContent.content = content;
           await oldContent.save();
           res.status(200).send(oldContent);
        } else {
            throw new ForbiddenError('Only the author of the post can perform this action');
        }
    }
});

export { router as contentEditRouter }

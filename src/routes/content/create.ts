import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { requireAuth } from '../../middlewares/requireAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { User, UserType } from '../../models/User';
import { Content } from '../../models/Content';
import { BadRequestError } from '../../errors/BadRequestError';

const router = Router();

interface UserInfo {
    email: string;
    type: UserType;
    id: string
}
router.post('/content/create', requireAuth, [
    body('content')
        .not()
        .isEmpty()
        .withMessage('Please provide the text to create')
],
validateRequest,
async (req: Request, res: Response) => {
    const { title, content, institute, branch, tag } = req.body;
    const userInfo = jwt.verify(req.session?.jwt, process.env.JWT_KEY!) as UserInfo;
    const author = await User.findOne({ email: userInfo.email });
    if(!author) {
        throw new BadRequestError('Invalid User');
    }

    const newContent = Content.build({ author, institute, branch, tag, timestamp: new Date(), title, content });
    await newContent.save();
    
    res.status(201).send({ postId: newContent.get('_id') });
});

export { router as contentCreateRouter }

import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { requireAuth } from '../../middlewares/requireAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { User, UserType } from '../../models/User';
import { Content, ContentType } from '../../models/Content';
import { Institute, BranchInfo } from '../../models/Institute';
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
        .withMessage('Please provide the content to create')
],
validateRequest,
async (req: Request, res: Response) => {
    const { title, institute, branch, tag } = req.body;
    const content = req.body.content as  ContentType[];
    const userInfo = jwt.verify(req.session?.jwt, process.env.JWT_KEY!) as UserInfo;
    const author = await User.findOne({ email: userInfo.email });
    if(!author) {
        throw new BadRequestError('Invalid user');
    }

    const existingInstitute = await Institute.findOne({ name: institute });
    if (existingInstitute) {
        const branches = existingInstitute.branches as BranchInfo[];
        if(!branches.some(existingBranch => existingBranch.name === branch)) {
            branches.push({ name: branch });
            await existingInstitute.save();
        }
    } else {
        const newInstitute = Institute.build({ name: institute, branches: [{ name: branch }] });
        await newInstitute.save();
    }

    const newContent = Content.build({ author, institute, branch, tag, timestamp: new Date(), title, content });
    await newContent.save();
    
    res.status(201).send({ postId: newContent.get('_id') });
});

export { router as contentCreateRouter }

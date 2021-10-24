import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

import { BadRequestError } from '../../errors/BadRequestError';
import { Content, ContentDoc } from '../../models/Content';

const router = Router();

interface QueryParams {
    id?: string;
    institute?: string;
    branch?: string;
    tag?: string;
}

router.get('/content/show', async (req: Request, res: Response) => {
    let posts: ContentDoc[] = [];
    if (Object.keys(req.query).length === 0) {
       posts = await Content.find().populate('author');
     } else {
        const { id, institute, branch, tag } = req.query as QueryParams; 
        const query: { [key: string]: string } = {};
        if (id) {
            if (mongoose.Types.ObjectId.isValid(id)) {
                query['_id'] = id;
            } else {
                throw new BadRequestError('Invalid ID');
            }
        }
          
        if (institute) query['institute'] = institute;

        if (branch) query['branch'] = branch;
        
        if (tag) query['tag'] = tag;

        posts = await Content.find(query).populate('author'); 
    }
     
    res.status(200).send({ posts });
});

export { router as contentShowRouter }

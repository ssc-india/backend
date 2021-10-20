import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

import { BadRequestError } from '../../errors/BadRequestError';
import { Content, ContentDoc } from '../../models/Content';

const router = Router();
interface QueryParams {
    id?: string;
    institute?: string;
    branch?: string;
}

router.get('/content/show', async (req: Request, res: Response) => {
    let posts: ContentDoc[] = [];
    if (Object.keys(req.query).length === 0) {
       posts = await Content.find();
     } else {
        const { id, institute, branch } = req.query as QueryParams; 
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
            
        posts = await Content.find(query); 
    }
     
    res.status(200).send({ posts });
});

export { router as contentShowRouter }
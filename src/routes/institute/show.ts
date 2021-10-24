import { Router, Request, Response } from 'express';
import { Institute } from '../../models/Institute';

const router = Router();

router.get('/institute/show', async (req: Request, res: Response) => {
    const institutes = await Institute.find();

    res.status(200).send(institutes);
});

export { router as instituteShowRouter }

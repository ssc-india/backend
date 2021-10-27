import request from 'supertest';

import app from '../../../app';
import { signup, clearDB, checkErrors, getFakeCookie } from '../../../test/utils';
import { Content, ContentTag } from '../../../models/Content';
import { Institute } from '../../../models/Institute';
import { ErrorType } from '../../../errors/errorType';

describe('Test the post creation functionality', () => {

    beforeEach(async () => { await clearDB() });

    it('fails if the user is not signed in', async () => {
        const response = await request(app)
            .post('/content/create')
            .send({
                title: 'Test',
                institute: 'IIT Madras',
                branch: 'Physics',
                tag: ContentTag.INFO,
                content: [
                    {
                        type: 'p',
                        content: 'Hi there!'
                    }
                ]
            })
            .expect(401);
        
        checkErrors((response.body.errors as ErrorType[]), 1, ['You need to sign in first']);
    });

    it('fails if no content is provided', async () => {
        const cookie = await signup('Niranjan Kamath', 'niranjankamath', 'IIT Madras', 'Physics', 'abc@abc.com', 'password');
        const response = await request(app)
            .post('/content/create')
            .set('Cookie', cookie)
            .send({
                title: 'Test',
                institute: 'IIT Madras',
                branch: 'Physics',
                tag: ContentTag.INFO,
            })
            .expect(400)

        checkErrors((response.body.errors as ErrorType[]), 1, ['Please provide the content to create']);
    });

    it('fails if an invalid user is provided', async () => {
        const cookie = getFakeCookie('fake@abc.com');
        const response = await request(app)
            .post('/content/create')
            .set('Cookie', cookie) 
            .send({
                title: 'Test',
                institute: 'IIT Madras',
                branch: 'Physics',
                tag: ContentTag.INFO,
                content: [
                    {
                        type: 'p',
                        content: 'Hi there!'
                    }
                ]
            })
            .expect(400);

        checkErrors((response.body.errors as ErrorType[]), 1, ['Invalid user']);
    });

    it('succesfully creates the new content', async () => {
        const user = 'abc1@abc.com';
        const cookie = await signup('Niranjan Kamath', 'niranjankamath', 'IIT Madras', 'Physics', user, 'password');
        const response = await request(app)
            .post('/content/create')
            .set('Cookie', cookie)
            .send({
                title: 'Test',
                institute: 'IIT Madras',
                branch: 'Physics',
                tag: ContentTag.INFO,
                content: [
                    {
                        type: 'p',
                        content: 'Hi there!'
                    }
                ]
            })
            .expect(201);

        expect(response.body.postId).toBeDefined();
        const newContent = await Content.findById(response.body.postId).populate('author');

        expect(newContent).toBeDefined();
        expect(newContent!.author.email).toEqual(user);
    });

    it('creates a new branch in an existing institute if post is about an unseen branch', async () => {
        const instituteEntry = Institute.build({ name: 'IIT Madras', branches: [{ name: 'Mathematics' }] });
        await instituteEntry.save();
        
        const cookie = await signup('Niranjan Kamath', 'niranjankamath', 'IIT Madras', 'Physics', 'nknk@test.com', 'password');
        const response = await request(app)
            .post('/content/create')
            .set('Cookie', cookie)
            .send({
                title: 'Test',
                institute: 'IIT Madras',
                branch: 'Physics',
                tag: ContentTag.INFO,
                content: [
                    {
                        type: 'p',
                        content: 'Hi there!'
                    }
                ]
            })
            .expect(201);

        const institute = await Institute.findOne({ name: 'IIT Madras' });

        expect(institute).toBeDefined();
        expect(institute!.branches.some(branch => branch.name === 'Physics')).toBe(true);
    });

    it('creates a new institute and branch if post is about an unseen institute', async () => {
        const instituteEntry = Institute.build({ name: 'IIT Madras', branches: [{ name: 'Mathematics' }] });
        await instituteEntry.save();
        
        const cookie = await signup('Niranjan Kamath', 'niranjankamath', 'IIT Madras', 'Physics', 'nknk@test.com', 'password');
        const response = await request(app)
            .post('/content/create')
            .set('Cookie', cookie)
            .send({
                title: 'Test',
                institute: 'IIT Delhi',
                branch: 'Biosciences',
                tag: ContentTag.INFO,
                content: [
                    {
                        type: 'p',
                        content: 'Hi there!'
                    }
                ]
            })
            .expect(201);

        const institute = await Institute.findOne({ name: 'IIT Delhi' });

        expect(institute).toBeDefined();
        expect(institute!.branches.some(branch => branch.name === 'Biosciences')).toBe(true);
    });
});

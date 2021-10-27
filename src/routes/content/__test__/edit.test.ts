import request from 'supertest';
import mongoose from 'mongoose';

import app from '../../../app';
import { signup, initializeContent, clearDB, checkErrors, getFakeCookie } from '../../../test/utils';
import { User } from '../../../models/User';
import { Content } from '../../../models/Content';
import jwt from 'jsonwebtoken';
import { ErrorType } from '../../../errors/errorType';

describe('Test edit functionality for posts', () => {
    let testId: string = '';
    let testCookie: string[];
    
    beforeAll(async () => {
        await clearDB();
        testCookie = await signup('Niranjan Kamath', 'niranjankamath', 'IIT Madras', 'Physics', 'nk@test.com', 'password');
        const user = (await User.find())[0];
        testId = await initializeContent(user, 1);
    });

    afterAll(async () => {
        await clearDB();
    });

    it('checks if the user is authenticated', async () => {
        const response = await request(app)
            .post('/content/edit')
            .send({
                postId: '12234',
                content: [
                    {
                        type: 'p',
                        content: 'Hi there!'
                    }
                ]
            })
            .expect(401)

        checkErrors((response.body.errors as ErrorType[]), 1, ['You need to sign in first']);
    });

    it('fails if a valid postId or content is not provided', async () => {
        const response = await request(app)
            .post('/content/edit')
            .set('Cookie', testCookie)
            .send()
            .expect(400)

        checkErrors((response.body.errors as ErrorType[]), 3, ['Please provide a valid Post ID', 'Post ID is invalid', 'Please provide updated content']);
    });

    it('fails if invalid ObjectID is provided', async () => {
        const response = await request(app)
            .post('/content/edit')
            .set('Cookie', testCookie)
            .send({
                postId: '1234',
                content: [
                    {
                        type: 'p',
                        content: 'Hi there!'
                    }
                ]
            })
            .expect(400)

        checkErrors((response.body.errors as ErrorType[]), 1, ['Post ID is invalid']);
    });

    it('fails if the user is invalid', async () => {
        let fakeCookie = getFakeCookie('fake@abc.com');
        const response = await request(app)
            .post('/content/edit')
            .set('Cookie', fakeCookie)
            .send({
                postId: testId,
                content: [
                    {
                        type: 'p',
                        content: 'Hi there!'
                    }
                ]
            })
            .expect(400)

        checkErrors((response.body.errors as ErrorType[]), 1, ['Invalid user']);
    });

    it('fails if the post to edit is non-existent', async () => {
        const fakeId = '6173f61eae545d3586d2887e';
        const response = await request(app)
            .post('/content/edit')
            .set('Cookie', testCookie)
            .send({
                postId: fakeId,
                content: [
                    {
                        type: 'p',
                        content: 'Hi there!'
                    }
                ]
            })
            .expect(400)

        checkErrors((response.body.errors as ErrorType[]), 1, ['Content not found']);
    });

    it('fails if the user is not the author of the post', async () => { 
        const fakeCookie = await signup('Niranjan Kamath', 'niranjankamath', 'IIT Madras', 'Physics', 'abcabc@test.com', 'password');
        const response = await request(app)
            .post('/content/edit')
            .set('Cookie', fakeCookie)
            .send({
                postId: testId,
                content: [
                    {
                        type: 'p',
                        content: 'Hi there!'
                    }
                ]
            })
            .expect(403)

        checkErrors((response.body.errors as ErrorType[]), 1, ['Only the author of the post can perform this action']);
    });

    it('successfully updates the content if all is good', async () => {
        const newContent = 'New content';
        const response = await request(app)
            .post('/content/edit')
            .set('Cookie', testCookie)
            .send({
                postId: testId,
                content: [
                    {
                        type: 'p',
                        content: newContent
                    }
                ]
            })
            .expect(200)

        expect(response.body.content).toBeDefined();
        expect(response.body.content[0].content).toEqual(newContent);
        
        const id = response.body.id;
        const updatedContent = await Content.findById(id);

        expect(updatedContent).toBeDefined();
        expect(updatedContent!.content[0].content).toEqual(newContent);
    });
});

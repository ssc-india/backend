import request from 'supertest';
import mongoose from 'mongoose';

import app from '../../../app';
import { signup, signin, getFakeCookie, initializeContent, clearDB, checkErrors } from '../../../test/utils';
import { User } from '../../../models/User';
import { Content } from '../../../models/Content';
import jwt from 'jsonwebtoken';
import { ErrorType } from '../../../errors/errorType';

describe('Test edit functionality for posts', () => {
    let testId: string = '';
    let testCookie: string[];
    
    beforeAll(async () => {
        await clearDB();
        await signup('Niranjan Kamath', 'niranjankamath', 'IIT Madras', 'Physics', 'nk@test.com', 'password');
        testCookie = await signin('nk@test.com', 'password');  
        const user = (await User.find())[0];
        testId = await initializeContent(user, 1);
    });

    afterAll(async () => {
        await clearDB();
    });

    it('checks if the user is authenticated', async () => {
        const response = await request(app)
            .post('/content/delete')
            .send({ postId: '12234' })
            .expect(401)

        checkErrors((response.body.errors as ErrorType[]), 1, ['You need to sign in first']);
    });

    it('fails if a valid postId is not provided', async () => {
        const response = await request(app)
            .post('/content/delete')
            .set('Cookie', testCookie)
            .send()
            .expect(400)
        
        checkErrors((response.body.errors as ErrorType[]), 2, ['Please provide a valid Post ID', 'Post ID is invalid']);
    });

    it('fails if invalid ObjectID is provided', async () => {
        const response = await request(app)
            .post('/content/delete')
            .set('Cookie', testCookie)
            .send({ postId: '1234' })
            .expect(400)
            
        checkErrors((response.body.errors as ErrorType[]), 1, ['Post ID is invalid']);
    });

    it('fails if the user is invalid', async () => {
        let fakeCookie = getFakeCookie('fake@abc.com');
        const response = await request(app)
            .post('/content/delete')
            .set('Cookie', fakeCookie)
            .send({ postId: testId })
            .expect(400)

        checkErrors((response.body.errors as ErrorType[]), 1, ['Invalid user']);
    });

    it('fails if the post to delete is non-existent', async () => {
        const fakeId = '6173f61eae545d3586d2887e';
        const response = await request(app)
            .post('/content/delete')
            .set('Cookie', testCookie)
            .send({ postId: fakeId })
            .expect(400)

        checkErrors((response.body.errors as ErrorType[]), 1, ['Content not found']);
    });

    it('fails if the user is not the author of the post', async () => { 
        await signup('Niranjan Kamath', 'niranjankamath', 'IIT Madras', 'Physics', 'abcabc@test.com', 'password');
        const fakeCookie = await signin('abcabc@test.com', 'password'); 
        const response = await request(app)
            .post('/content/delete')
            .set('Cookie', fakeCookie)
            .send({ postId: testId })
            .expect(403)

        checkErrors((response.body.errors as ErrorType[]), 1, ['Only the author or a moderator can perform this action']);
    });

    it('successfully deletes the content if all is good', async () => {
        const response = await request(app)
            .post('/content/delete')
            .set('Cookie', testCookie)
            .send({ postId: testId })
            .expect(200);

        const id = response.body.id;
        const deletedContent = await Content.findById(id);

        expect(deletedContent).toBeNull();
    });
});

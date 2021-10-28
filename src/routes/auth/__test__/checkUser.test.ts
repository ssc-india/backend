import request from 'supertest';
import app from '../../../app';

import { clearDB, signup, signin } from '../../../test/utils';
import { UserInfo } from '../../../types';

describe('Test checkUser route for setting session cookie', () => {

    beforeEach(async () => { await clearDB() });

    afterAll(async () => { await clearDB() });

    it('sets current user as null if no session exists', async () => {
        const response = await request(app)
            .get('/auth/check_user')
            .send()
            .expect(200)

        expect(response.body.currentUser).toBeNull();
    });

    it('sets current user as the currently logged in user if a session exists', async () => {
        const email = 'nk@test.com';
        const username = 'niranjankamath';

        await signup('Niranjan Kamath', username, 'IIT Madras', 'Physics', email, 'password');
        const cookie = await signin('nk@test.com', 'password');

        const response = await request(app)
            .get('/auth/check_user')
            .set('Cookie', cookie)
            .send()
            .expect(200)

        expect(response.body.currentUser).not.toBeNull();

        const userInfo = response.body.currentUser as UserInfo;
        expect(userInfo.email).toEqual(email);
        expect(userInfo.username).toEqual(username);
    });
});

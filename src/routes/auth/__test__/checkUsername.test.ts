import request from 'supertest';
import app from '../../../app';

import { clearDB, signup, checkErrors } from '../../../test/utils';
import { ErrorType } from '../../../errors';

describe('test the username validation route', () => {

    beforeAll(async () => {
        await clearDB();
        await signup('Niranjan Kamath', 'niranjankamath', 'IIT Madras', 'Physics', 'nk@test.com', 'password');
    });

    afterAll(async () => { await clearDB() });

    it('fails if no username is provided', async () => {
        const response = await request(app)
            .post('/auth/check_username')
            .send({})
            .expect(400)

        checkErrors((response.body.errors as ErrorType[]), 1, ['Please provide a username']);
    });

    it('fails if a user with given username already exists', async () => {
        const response = await request(app)
            .post('/auth/check_username')
            .send({ username: 'niranjankamath' })
            .expect(400);

        checkErrors((response.body.errors as ErrorType[]), 1, ['Username already taken']);
    });

    it('succeeds if a given username is not taken', async () => {
        await request(app)
            .post('/auth/check_username')
            .send({ username: 'nkamath' })
            .expect(200)
    });
});

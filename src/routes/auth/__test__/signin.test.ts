import request from 'supertest'
import app from '../../../app';
import { signup, clearDB, checkErrors } from '../../../test/utils';
import { ErrorType } from '../../../errors';

describe('Test the signin functionality', () => {

    beforeEach(async () => { await clearDB() });

    it('fails if a non existent user is supplied', async () => {
        const response = await request(app)
            .post('/auth/signin')
            .send({
                identity: 'niranjan@test.com',
                password: 'password'
            })
            .expect(400);

        checkErrors((response.body.errors as ErrorType[]), 1, ['Invalid Credentials']);
    });

    it('fails if the user supplies the incorrect password', async () => {
        await signup('Niranjan Kamath', 'niranjankamath', 'IIT Madras', 'Physics', 'nk@test.com', 'password');
        const response = await request(app)
            .post('/auth/signin')
            .send({
                identity: 'nk@test.com',
                password: 'wrong_password'
            })
            .expect(400);
        
        checkErrors((response.body.errors as ErrorType[]), 1, ['Invalid Credentials']);
    });

    it('returns a cookie to the user after successful sign in via email or username', async () => {
        await signup('Niranjan Kamath', 'niranjankamath', 'IIT Madras', 'Physics', 'niranjan@test.com', 'password');
        let response = await request(app)
            .post('/auth/signin')
            .send({
                identity: 'niranjan@test.com',
                password: 'password'
            })
            .expect(200)

        expect(response.get('Set-Cookie')).toBeDefined();

        response = await request(app)
            .post('/auth/signin')
            .send({
                identity: 'niranjankamath',
                password: 'password'
            })
            .expect(200)

        expect(response.get('Set-Cookie')).toBeDefined();
    });
});

import request from 'supertest'
import app from '../../../app';
import { signup, clearDB } from '../../../test/utils';

describe('Test the signin functionality', () => {

    beforeEach(async () => { await clearDB() });

    it('fails if a non existent user is supplied', async () => {
        await request(app)
            .post('/auth/signin')
            .send({
                name: 'Niranjan Kamath',
                institute: 'IIT Madras',
                branch: 'Physics',
                email: 'niranjan@test.com',
                password: 'password'
            })
            .expect(400);
    });

    it('fails if the user supplies the incorrect password', async () => {
        await signup('Niranjan Kamath', 'IIT Madras', 'Physics', 'nk@test.com', 'password');
        const response = await request(app)
            .post('/auth/signin')
            .send({
                name: 'Niranjan Kamath',
                institute: 'IIT Madras',
                branch: 'Physics',
                email: 'nk@test.com',
                password: 'wrong_password'
            })
            .expect(400);
    });

    it('returns a cookie to the user after successful sign in', async () => {
        await signup('Niranjan Kamath', 'IIT Madras', 'Physics', 'niranjan@test.com', 'password');
        const response = await request(app)
            .post('/auth/signin')
            .send({
                name: 'Niranjan Kamath',
                institute: 'IIT Madras',
                branch: 'Physics',
                email: 'niranjan@test.com',
                password: 'password'
            });

        expect(response.status).toEqual(200);
        expect(response.get('Set-Cookie')).toBeDefined();
    });
});

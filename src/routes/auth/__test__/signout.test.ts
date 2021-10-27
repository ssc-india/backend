import request from 'supertest';
import app from '../../../app';
import { signup, clearDB } from '../../../test/utils';

describe('Test the signout functionality', () => {
    
    beforeEach(async () => { await clearDB() });

    it('clears the cookie after signing out', async () => {
        await signup('Niranjan Kamath', 'niranjankamath', 'IIT Madras', 'Physics', 'nk@test.com', 'password');
        const response = await request(app)
            .post('/auth/signout')
            .send({})
            .expect(200);

        expect(response.get('Set-Cookie')).toBeDefined();
    });
});

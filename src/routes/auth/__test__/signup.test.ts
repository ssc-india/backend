import request from 'supertest'
import app from '../../../app';
import { User } from '../../../models';
import { transporter, Password } from '../../../services';
import { signup, clearDB, checkErrors } from '../../../test/utils';
import { ErrorType } from '../../../errors';

describe('Test the signout functionality', () => {

    beforeEach(async () => { await clearDB() });

    it('throws a bad request error if required fields are missing', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({})
            .expect(400);

        checkErrors((response.body.errors as ErrorType[]), 5, [
            'Please provide a valid email',
            'Password must be at least 8 characters long',
            'Please provide a username',
            'Please provide the institute you are studying in',
            'Please provide the branch you are enrolled in'
        ]); 
    });

    it('throws a bad request error if email is invalid', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({
                name: 'Niranjan Kamath',
                username: 'niranjankamath',
                institute: 'IIT Madras',
                branch: 'Physics',
                email: 'nk@testcom',
                password: 'password'
            })
            .expect(400);

        checkErrors((response.body.errors as ErrorType[]), 1, ['Please provide a valid email']);
    });

    it('throws a bad request error if the password does not meet the requirements', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({
                name: 'Niranjan Kamath',
                username: 'niranjankamath',
                institute: 'IIT Madras',
                branch: 'Physics',
                email: 'nk@test.com',
                password: 'pass'
            })
            .expect(400);

        checkErrors((response.body.errors as ErrorType[]), 1, ['Password must be at least 8 characters long']);
    });

    it('checks if the user already exists based on both email and username', async () => {
        await signup('Niranjan Kamath', 'niranjankamath', 'IIT Madras', 'Physics', 'nk@test.com', 'password');

        let response = await request(app)
            .post('/auth/signup')
            .send({
                name: 'Niranjan Kamath',
                username: 'niranjankamathnew',
                institute: 'IIT Madras',
                branch: 'Physics',
                email: 'nk@test.com',
                password: 'password'
            })
            .expect(400);

        checkErrors((response.body.errors as ErrorType[]), 1, ['Email already in use!']);

        response = await request(app)
            .post('/auth/signup')
            .send({
                name: 'Niranjan Kamath',
                username: 'niranjankamath',
                institute: 'IIT Madras',
                branch: 'Physics',
                email: 'nknew@test.com',
                password: 'password'
            })
            .expect(400);

        checkErrors((response.body.errors as ErrorType[]), 1, ['Username already taken']);
    });

    it('adds user to the database if all the tests pass', async () => {
        await signup('Niranjan Kamath', 'niranjankamath', 'IIT Madras', 'Physics', 'nk@test.com', 'password');
        const existingUser = await User.findOne({ email: 'nk@test.com' });
        expect(existingUser).toBeDefined();
        
        const passwordsMatch = await Password.compare(existingUser!.get('password'), 'password');
        expect(passwordsMatch).toEqual(true);
    });

    it('sends an email to the user', async () => {
        await signup('Niranjan Kamath', 'niranjankamath', 'IIT Madras', 'Physics', 'nk@test.com', 'password');

        expect(transporter.sendMail).toHaveBeenCalled();
    });
});

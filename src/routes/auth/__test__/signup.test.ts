import request from 'supertest'
import app from '../../../app';
import { User } from '../../../models/User';
import { Password } from '../../../services/Password';
import { signup, clearDB, checkErrors } from '../../../test/utils';
import { ErrorType } from '../../../errors/errorType';
import { transporter } from '../../../services/EmailTransporter';

describe('Test the signout functionality', () => {

    beforeEach(async () => { await clearDB() });

    it('throws a bad request error if either email or password is missing', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({});

        expect(response.status).toEqual(400);
        checkErrors((response.body.errors as ErrorType[]), 2, ['Please provide a valid email', 'Password must be at least 8 characters long']); 
    });

    it('throws a bad request error if email is invalid', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({
                name: 'Niranjan Kamath',
                institute: 'IIT Madras',
                branch: 'Physics',
                email: 'nk@testcom',
                password: 'password'
            });

        expect(response.status).toEqual(400);
        checkErrors((response.body.errors as ErrorType[]), 1, ['Please provide a valid email']);
    });

    it('throws a bad request error if the password does not meet the requirements', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({
                name: 'Niranjan Kamath',
                institute: 'IIT Madras',
                branch: 'Physics',
                email: 'nk@test.com',
                password: 'pass'
            });

        expect(response.status).toEqual(400);
        checkErrors((response.body.errors as ErrorType[]), 1, ['Password must be at least 8 characters long']);
    });

    it('checks if the user already exists', async () => {
        await request(app)
            .post('/auth/signup')
            .send({
                name: 'Niranjan Kamath',
                institute: 'IIT Madras',
                branch: 'Physics',
                email: 'nk@test.com',
                password: 'password'
            })
            .expect(201);

        const response = await request(app)
            .post('/auth/signup')
            .send({
                name: 'Niranjan Kamath',
                institute: 'IIT Madras',
                branch: 'Physics',
                email: 'nk@test.com',
                password: 'password'
            });

        expect(response.status).toEqual(400);
        checkErrors((response.body.errors as ErrorType[]), 1, ['Email already in use!']);
    });

    it('adds user to the database if all the tests pass', async () => {
        await signup('Niranjan Kamath', 'IIT Madras', 'Physics', 'nk@gmail.com', 'password');
        const existingUser = await User.findOne({ email: 'nk@gmail.com' });
        expect(existingUser).toBeDefined();
        
        const passwordsMatch = await Password.compare(existingUser!.get('password'), 'password');
        expect(passwordsMatch).toEqual(true);
    });

    it('sends an email to the user', async () => {
        await request(app)
            .post('/auth/signup')
            .send({
                name: 'Niranjan Kamath',
                institute: 'IIT Madras',
                branch: 'Physics',
                email: 'niranjan@test.com',
                password: 'password'
            })
            .expect(201);

        expect(transporter.sendMail).toHaveBeenCalled();
    });

    it('generates and sends a cookie back with the user info', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({
                name: 'Niranjan Kamath',
                institute: 'IIT Madras',
                branch: 'Physics',
                email: 'niranjan@test.com',
                password: 'password'
            })
            .expect(201);

        expect(response.get('Set-Cookie')).toBeDefined();
    });
});

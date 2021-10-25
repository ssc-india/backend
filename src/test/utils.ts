import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app';
import mongoose from 'mongoose';
import { User, UserDoc } from '../models/User';
import { Content, ContentTag } from '../models/Content';
import { ErrorType } from '../errors/errorType';

const institutes = ['IIT Madras', 'IISER Pune', 'IIT Bombay', 'IISER TVM', 'IIT KGP', 'IISER Kolkata'];
const branches = ['Physics', 'Mathematics', 'Chemistry', 'Biology'];

export const initializeContent = async (user: UserDoc, nItems: number) => {
    const nInstitutes = institutes.length;
    const nBranches = branches.length;

    for (let i = 0; i < nItems; i++) {
        const instituteId = Math.floor(Math.random() * nInstitutes);
        const branchId = Math.floor(Math.random() * nBranches);
        const newContent = Content.build({
            author: user,
            institute: institutes[instituteId],
            branch: branches[branchId],
            tag: ContentTag.INFO,
            timestamp: new Date(),
            title: 'Test Post',
            content: [
                {
                    type: 'p',
                    content: 'test'
                }
            ]
        });
        await newContent.save();
    }

    const allContents = await Content.find();
    return allContents[0].id;
}

export const clearContent = async () => {
    await Content.deleteMany();
}

export const signup = async (name: string, institute: string, branch: string, email: string, password: string) => {
    const response = await request(app)
            .post('/auth/signup')
            .send({
                name,
                institute,
                branch,
                email,
                password
            })
            .expect(201);

    const cookie = response.get('Set-Cookie');

    return cookie;
};

export const clearDB = async () => {
    const collections = await mongoose.connection.db.collections();

    for(let collection of collections) {
        await collection.deleteMany({});
    }
} 

export const getFakeCookie = (email: string) => {
    let fakeCookie = Buffer.from(JSON.stringify({ jwt: jwt.sign({ email }, process.env.JWT_KEY!) })).toString('base64');
    return `express:sess=${fakeCookie}`;
}

export const checkErrors = (errors: ErrorType[], length: number, contents: string[]) => {
    expect(length === contents.length);
    expect(errors).toBeDefined();
    expect(errors.length).toBeDefined();
    expect(errors.length).toEqual(length);

    contents.forEach((item, index) => {
        expect(errors[index].message).toEqual(item);
    });
}

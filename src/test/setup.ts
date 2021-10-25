import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import app from '../app';
import { initializeContent, clearContent, clearDB } from './utils';

let mongo: any;
beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri);
});

afterAll(async () => {
    await clearDB();

    await mongo.stop();
    await mongoose.connection.close();
});

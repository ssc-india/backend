import app from './app';
import mongoose from 'mongoose'

import { DatabaseConnectionError } from './errors';

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY not defined');
    }
    
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI not defined');
    }

    if (!process.env.ORIGIN_WHITELIST) {
        throw new Error('ORIGIN_WHITELIST not defined');
    }

    if (!process.env.EMAIL_USER) {
        throw new Error('EMAIL_USER not defined');
    }

    if (!process.env.EMAIL_PASSWORD) {
        throw new Error('EMAIL_PASSWORD not defined');
    }

    if (!process.env.FRONTEND_URL) {
        throw new Error('FRONTEND_URL not defined');
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
    } catch (err) {
        throw new DatabaseConnectionError();
    }

    app.listen(process.env.PORT || 5000, () => {
        console.log('Server Started'); 
    });
}

start()

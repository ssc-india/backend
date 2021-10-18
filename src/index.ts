import app from './app';
import mongoose from 'mongoose'

import { DatabaseConnectionError } from './errors/DatabaseConnectionError';

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY not defined');
    }
    
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI not defined');
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
    } catch (err) {
        throw new DatabaseConnectionError();
    }

    app.listen(5000, () => {
        console.log('Server Started'); 
    });
}

start()

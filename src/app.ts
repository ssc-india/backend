import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import cookieSession from 'cookie-session'
import 'express-async-errors';

import { errorHandler } from './middlewares/errorHandler';
import { NotFoundError } from './errors/NotFoundError';

import { signupRouter } from './routes/auth/signup';
import { signinRouter } from './routes/auth/signin';
import { signoutRouter } from './routes/auth/signout';

const app = express();

app.set('trust proxy', true);

app.use(cors());
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));

app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);

app.all('*', () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export default app;

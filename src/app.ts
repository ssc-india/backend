import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import cookieSession from 'cookie-session'
import 'express-async-errors';

import { errorHandler } from './middlewares';
import { NotFoundError } from './errors';

import { signupRouter } from './routes/auth/signup';
import { signinRouter } from './routes/auth/signin';
import { signoutRouter } from './routes/auth/signout';
import { verifyEmailRouter } from './routes/auth/verifyEmail';
import { checkUsernameRouter } from './routes/auth/checkUsername';
import { checkUserRouter } from './routes/auth/checkUser';

import { contentCreateRouter } from './routes/content/create';
import { contentShowRouter } from './routes/content/show';
import { contentEditRouter } from './routes/content/edit';
import { contentDeleteRouter } from './routes/content/delete';

import { instituteShowRouter } from './routes/institute/show';

const app = express();

app.set('trust proxy', true);

app.use(cors({
    origin: process.env.ORIGIN_WHITELIST,
    credentials: true
}));
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));

app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(verifyEmailRouter);
app.use(checkUsernameRouter);
app.use(checkUserRouter);

app.use(contentCreateRouter);
app.use(contentShowRouter);
app.use(contentEditRouter);
app.use(contentDeleteRouter);

app.use(instituteShowRouter);

app.all('*', () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export default app;

import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@neffuke/common'
import { createChargeRouter } from './routes/new';

const app = express(); 
app.set('trust proxy', true);

app.use(json());
app.use(cookieSession({
    signed: false,
    // Only set cookies in https, not http (but allow http for tests)
    secure: false
}));
app.use(currentUser);

app.use(createChargeRouter);

app.all('*', async () => {
    console.log("In not found");
    throw new NotFoundError();
});

app.use(errorHandler);

export { app }
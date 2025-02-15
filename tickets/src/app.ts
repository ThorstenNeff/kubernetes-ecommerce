import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@neffuke/common'
import { createTicketRouter  } from './routes/new';
import { showTicketRouter  } from './routes/show';
import { indexTicketRouter } from './routes/index';
import { updateTicketRouter } from './routes/update';

const app = express(); 
app.set('trust proxy', true);

app.use(json());
app.use(cookieSession({
    signed: false,
    // Only set cookies in https, not http (but allow http for tests)
    secure: false
}));
app.use(currentUser);
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all('*', async () => {
    console.log("In not found");
    throw new NotFoundError();
});

app.use(errorHandler);

export { app }
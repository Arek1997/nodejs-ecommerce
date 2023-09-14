import path from 'path';
import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import csrf from 'csurf';
import flash from 'connect-flash';

import adminRoutes from './routes/admin';
import shopRoutes from './routes/shop';
import authRoutes from './routes/auth';
import errorRoutes from './routes/error';

import setSessionMiddleware from './middleware/session';
import assignUserMiddleware from './middleware/assign-user';
import addValuesToViews from './middleware/add-values-to-views';

import connectMongoose from './lib/mongoose';
import { get500 } from './controllers/error/get500';

const app = express();
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(setSessionMiddleware);
app.use(flash());
app.use(csrfProtection);
app.use(assignUserMiddleware);
app.use(addValuesToViews);

//Routing
app.use('/admin', adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);
app.use(errorRoutes);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
	get500(req, res, next);
});

connectMongoose(() => app.listen(3000));

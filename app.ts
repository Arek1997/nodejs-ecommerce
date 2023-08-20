import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import csrf from 'csurf';
import flash from 'connect-flash';

import adminRoutes from './routes/admin';
import shopRoutes from './routes/shop';
import authRoutes from './routes/auth';

import { get404 } from './controllers/error';

import setSessionMiddleware from './middleware/session';
import assignUserMiddleware from './middleware/assign-user';
import addValuesToViews from './middleware/add-values-to-views';

import connectMongoose from './lib/mongoose';

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

app.use('/admin', adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);
app.use(get404);

connectMongoose(() => app.listen(3000));

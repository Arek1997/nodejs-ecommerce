require('dotenv').config();
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import session from 'express-session';
const MongoDBStore = require('connect-mongodb-session')(session);

import adminRoutes from './routes/admin';
import shopRoutes from './routes/shop';
import authRoutes from './routes/auth';

import { get404 } from './controllers/error';

import User from './models/user';

import { MONGODB_URL } from './utils';

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
	session({
		secret: process.env.SESSION_SECRET!,
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 60 * 60 * 1000, // 1h
			httpOnly: true,
		},
		store: new MongoDBStore({
			uri: MONGODB_URL,
			collection: 'sessions',
		}),
	})
);

app.use(async (req, res, next) => {
	try {
		res.locals.isAuthenticated = req.session.isLoggedIn;

		if (req.session.isLoggedIn) {
			req.session.user = User.hydrate(req.session.user);
		}
	} catch (err) {
		console.log(err);
	} finally {
		next();
	}
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(get404);

const connectMongoose = async () => {
	try {
		await mongoose.connect(MONGODB_URL);
		const user = await User.findOne();

		if (!user) {
			User.create({
				name: 'Arek',
				email: 'test@test.com',
				cart: {
					items: [],
				},
			});
		}

		app.listen(3000);
	} catch (err) {
		console.log(err);
	}
};

connectMongoose();

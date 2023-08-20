require('dotenv').config();

import session from 'express-session';
const MongoDBStore = require('connect-mongodb-session')(session);
import { MONGODB_URL } from '../utils';

const setSessionMiddleware = session({
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
});

export default setSessionMiddleware;

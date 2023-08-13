import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';

import adminRoutes from './routes/admin';
import shopRoutes from './routes/shop';
import { get404 } from './controllers/error';
import User from './models/user';
import mongoose from 'mongoose';
import { MONGODB_URL } from './utils';

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, _, next) => {
	try {
		const user = await User.findById('64c945f0f6a79e87c045292e');
		req.user = user;
		next();
	} catch (err) {
		console.log(err);
	}
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

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

import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';

import adminRoutes from './routes/admin';
import shopRoutes from './routes/shop';
import { get404 } from './controllers/error';
import mongoConnect from './libs/database';
import User, { UserInterface } from './models/user';

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, _, next) => {
	try {
		const user = (await User.findById(
			'64c2ac8e9bd7135c73ae6f60'
		)) as unknown as UserInterface;

		const { _id, name, email, cart } = user;

		req.user = new User(name, email, cart, _id);
		next();
	} catch (err) {
		console.log(err);
	}
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404);

mongoConnect().then(() => {
	app.listen(3000);
});

import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';

import adminRoutes from './routes/admin';
import shopRoutes from './routes/shop';
import { get404 } from './controllers/error';
import sequelize from './libs/database';
import Product from './models/product';
import User from './models/user';

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, _, next) => {
	try {
		const user = await User.findByPk(1);
		req.user = user;

		next();
	} catch (err) {
		console.log(err);
	}
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

sequelize
	// .sync({ force: true })
	.sync()
	.then((result) => {
		// console.log(result);
		return User.findByPk(1);
	})
	.then((user) => {
		if (!user) {
			return User.create({
				name: 'Arek',
				email: 'test@test.com',
			});
		}

		return user;
	})
	.then((user) => {
		// console.log(user);
		app.listen(3000);
	})
	.catch((err) => {
		console.log(err);
	});

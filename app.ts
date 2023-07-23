import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';

import adminRoutes from './routes/admin';
import shopRoutes from './routes/shop';
import { get404 } from './controllers/error';
import mongoConnect from './libs/database';

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, _, next) => {
	// try {
	// 	const user = await User.findByPk(1);
	// 	req.user = user;
	// 	next();
	// } catch (err) {
	// 	console.log(err);
	// }
	next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404);

mongoConnect().then(() => {
	app.listen(3000);
});

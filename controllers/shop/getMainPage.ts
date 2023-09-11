import { RequestHandler } from 'express';
import Product from '../../models/product';

export const getMainPage: RequestHandler = async (_, res) => {
	const latestProduct = await Product.findOne().sort({ _id: -1 });

	res.render('shop/index', {
		latestProduct,
		title: 'Welcone to out shop!',
		path: '/',
	});
};

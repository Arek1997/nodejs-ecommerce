import { RequestHandler } from 'express';
import Product from '../../models/product';

export const getProducts: RequestHandler = async (_, res) => {
	const productsList = await Product.find();

	res.render('shop/products-list', {
		productsList,
		title: 'All Products',
		path: '/products',
	});
};

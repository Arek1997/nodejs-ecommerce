import { RequestHandler } from 'express';
import Product from '../../models/product';

export const getProducts: RequestHandler = async (req, res) => {
	const userId = req.session.user;
	const productsList = await Product.find({ userId });

	res.render('admin/products-list', {
		productsList,
		title: 'Admin Products',
		path: '/admin/products',
	});
};

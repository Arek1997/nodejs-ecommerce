import { RequestHandler } from 'express';
import Product, { ProductInterface } from '../../models/product';

export const postAddProduct: RequestHandler = async (req, res) => {
	const productData: Omit<ProductInterface, 'userId'> = req.body;

	const loggedUser = req.session.user;

	await Product.create({ ...productData, userId: loggedUser });

	res.redirect('/products');
};

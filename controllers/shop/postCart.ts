import { RequestHandler } from 'express';
import Product from '../../models/product';

export const postCart: RequestHandler = async (req, res) => {
	const productId = req.body.id;
	const product = await Product.findById(productId);

	console.log(req.session);

	await req.session.user.addToCart(product);

	res.redirect('/cart');
};

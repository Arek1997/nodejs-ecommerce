import { RequestHandler } from 'express';
import Order from '../../models/order';

export const postOrder: RequestHandler = async (req, res) => {
	const { email, _id } = req.session.user;

	const products = await req.session.user
		.populate('cart.items.productId')
		.then((products: any) =>
			products.cart.items.map((item: any) => {
				return { ...item.productId._doc, quantity: item.quantity };
			})
		);

	await Order.create({
		user: {
			email,
			_id,
		},
		products,
	});

	await req.session.user.clearCart();

	res.redirect('/orders');
};

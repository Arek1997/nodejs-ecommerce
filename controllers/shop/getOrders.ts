import { RequestHandler } from 'express';
import Order from '../../models/order';

export const getOrders: RequestHandler = async (req, res) => {
	const orders = await Order.find({ 'user._id': req.session.user._id });

	res.render('shop/orders', {
		title: 'Your Orders',
		path: '/orders',
		orders,
	});
};

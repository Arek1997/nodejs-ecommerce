import { RequestHandler } from 'express';

export const postRemoveFromCart: RequestHandler = async (req, res) => {
	try {
		const productId = req.params.id;
		await req.session.user.removeFromCart(productId);

		res.redirect('/cart');
	} catch (err) {
		console.error(err);
	}
};

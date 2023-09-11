import { RequestHandler } from 'express';
import Product from '../../models/product';

export const postDeleteProduct: RequestHandler = async (req, res) => {
	const productId = req.params.id;

	try {
		await Product.deleteOne({
			_id: productId,
			userId: req.session.user,
		});

		res.redirect('/admin/products');
	} catch (error) {
		console.log(error);
		res.redirect('/');
	}
};

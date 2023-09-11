import { RequestHandler } from 'express';
import Product, { ProductInterface } from '../../models/product';

export const postEditProduct: RequestHandler = async (req, res) => {
	const productId = req.params.id;

	try {
		const updatedProductData: ProductInterface = req.body;

		await Product.updateOne(
			{ _id: productId, userId: req.session.user },
			{ ...updatedProductData }
		);

		res.redirect('/admin/products');
	} catch (error) {
		console.log(error);
		res.redirect('/');
	}
};

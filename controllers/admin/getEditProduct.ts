import { RequestHandler } from 'express';
import Product from '../../models/product';

export const getEditProduct: RequestHandler = async (req, res) => {
	const productId = req.params.id;
	const userId = req.session.user._id.toString();

	try {
		const productToEdit = await Product.findById(productId);

		if (productToEdit?.userId?.toString() !== userId) {
			await Promise.reject('No autorized');
		}

		res.render('admin/edit-product', {
			productToEdit,
			title: `Edit | ${productToEdit?.title}`,
			path: '/admin/edit-product',
			editMode: true,
		});
	} catch (error) {
		console.log(error);
		res.redirect('/');
	}
};

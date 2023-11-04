import { RequestHandler } from 'express';
import Product from '../../models/product';

export const deleteProduct: RequestHandler = async (req, res) => {
	const productId = req.params.id;

	try {
		await Product.deleteOne({
			_id: productId,
			userId: req.session.user,
		});

		res
			.status(200)
			.json({ message: 'Success! Product has been deleted.', success: true });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message:
				'Some error occurred while deleting the product. Try again later.',
			success: false,
		});
	}
};

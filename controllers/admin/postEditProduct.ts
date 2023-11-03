import { RequestHandler } from 'express';
import Product, { ProductInterface } from '../../models/product';
import { inputFileAcceptedFiles } from '../../utils/consts';
import {
	ALLOWED_FILE_EXTENSIONS,
	HTML_FILE_INPUT_NAME_ATTRIBUTE,
} from '../../utils/multer';

export const postEditProduct: RequestHandler = async (req, res) => {
	const productId = req.params.id;

	try {
		const updatedProductData: Omit<ProductInterface, 'userId'> = req.body;
		const { title, description, price } = updatedProductData;

		const image = req.file;

		if (!image) {
			return res.status(422).render('admin/add-product', {
				title: `Edit | ${title}`,
				path: '/admin/edit-product',
				editMode: true,
				fileInputNameAttribute: HTML_FILE_INPUT_NAME_ATTRIBUTE,
				acceptedFiles: inputFileAcceptedFiles,
				errorMessage: `Image format is incorrect. Allowed formats are: ${ALLOWED_FILE_EXTENSIONS.join(
					', '
				)}`,
				inputs: {
					title,
					description,
					price,
				},
			});
		}

		const imageUrl = '/' + image.path;

		await Product.updateOne(
			{ _id: productId, userId: req.session.user },
			{ ...updatedProductData, imageUrl }
		);

		res.redirect('/admin/products');
	} catch (error) {
		console.error(error);
		res.redirect('/');
	}
};

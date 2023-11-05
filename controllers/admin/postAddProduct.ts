import { RequestHandler } from 'express';
import Product, { ProductInterface } from '../../models/product';
import {
	ALLOWED_FILE_EXTENSIONS,
	HTML_FILE_INPUT_NAME_ATTRIBUTE,
} from '../../utils/multer';
import { inputFileAcceptedFiles } from '../../utils/consts';

export const postAddProduct: RequestHandler = async (req, res) => {
	const productData: Omit<ProductInterface, 'userId'> = req.body;
	const { title, description, price } = productData;

	const image = req.file;

	if (!image) {
		return res.status(422).render('admin/add-product', {
			title: 'Admin Add Product',
			path: '/admin/add-product',
			editMode: false,
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
	const loggedUser = req.session.user;

	const dataToStore = {
		...productData,
		imageUrl,
		userId: loggedUser,
	};

	await Product.create(dataToStore);
	res.redirect('/admin/products');
};

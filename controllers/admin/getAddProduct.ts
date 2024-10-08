import { RequestHandler } from 'express';
import { HTML_FILE_INPUT_NAME_ATTRIBUTE } from '../../utils/multer';
import { inputFileAcceptedFiles } from '../../utils/consts';

export const getAddProduct: RequestHandler = (_, res) => {
	res.render('admin/add-product', {
		title: 'Admin Add Product',
		path: '/admin/add-product',
		editMode: false,
		fileInputNameAttribute: HTML_FILE_INPUT_NAME_ATTRIBUTE,
		acceptedFiles: inputFileAcceptedFiles,
	});
};

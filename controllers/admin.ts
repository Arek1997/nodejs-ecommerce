import { RequestHandler } from 'express';
import Product from '../models/product';

export const getAddProduct: RequestHandler = (_, res) => {
	res.render('admin/add-product', {
		title: 'Admin Add Product',
		path: '/admin/add-product',
	});
};

export const getProduct: RequestHandler = async (_, res) => {
	const response = await Product.fetchAll();

	res.render('admin/products-list', {
		productsList: response.productsList,
		title: 'Admin Products',
		path: '/admin/products',
	});
};

export const getEditProduct: RequestHandler = async (req, res) => {
	console.log(req.route);
	const response = await Product.fetchAll();

	res.render('admin/edit-product', {
		productsList: response.productsList,
		title: 'Edit Product',
		path: '/admin/edit-product',
	});
};

export const postAddProduct: RequestHandler = (req, res) => {
	const { title, imageUrl, description, price } = req.body as {
		title: string;
		imageUrl: string;
		description: string;
		price: string;
	};

	new Product(title, imageUrl, description, price);

	res.redirect('/products');
};

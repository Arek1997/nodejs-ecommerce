import { RequestHandler } from 'express';
import Product, { ProductItem } from '../models/product';

export const getProduct: RequestHandler = async (_, res) => {
	const products = await Product.fetchAll();

	res.render('admin/products-list', {
		productsList: products ? products : [],
		title: 'Admin Products',
		path: '/admin/products',
	});
};

export const getAddProduct: RequestHandler = (_, res) => {
	res.render('admin/add-product', {
		title: 'Admin Add Product',
		path: '/admin/add-product',
		editMode: false,
	});
};

export const postAddProduct: RequestHandler = async (req, res) => {
	const { title, imageUrl, description, price } = req.body as Omit<
		ProductItem,
		'id'
	>;

	const product = new Product(title, imageUrl, description, price);

	await product.save();

	res.redirect('/admin/products');
};

export const getEditProduct: RequestHandler = async (req, res) => {
	const productId = req.params.id;

	// const searchProduct = await Product.getById(productId);

	// res.render('admin/edit-product', {
	// 	productToEdit: searchProduct,
	// 	title: `Edit | ${searchProduct?.title}`,
	// 	path: '/admin/edit-product',
	// 	editMode: true,
	// });
};

export const postEditProduct: RequestHandler = async (req, res) => {
	const productId = req.params.id;
	const updatedProductData: Omit<ProductItem, 'id'> = req.body;

	await Product.edit(productId, updatedProductData);

	res.redirect('/admin/products');
};

export const postDeleteProduct: RequestHandler = async (req, res) => {
	const productId = req.params.id;

	await Product.remove(productId);

	res.redirect('/admin/products');
};

import { RequestHandler } from 'express';
import Product, { ProductItem } from '../models/product';

export const getProduct: RequestHandler = async (_, res) => {
	const response = await Product.fetchAll();

	res.render('admin/products-list', {
		productsList: response.productsList,
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

export const postAddProduct: RequestHandler = (req, res) => {
	const { title, imageUrl, description, price } = req.body as Omit<
		ProductItem,
		'id'
	>;

	new Product(title, imageUrl, description, price);

	res.redirect('/admin/products');
};

export const getEditProduct: RequestHandler = async (req, res) => {
	const productId = req.params.id;

	const searchProduct = await Product.getById(productId);

	res.render('admin/edit-product', {
		productToEdit: searchProduct,
		title: `Edit | ${searchProduct?.title}`,
		path: '/admin/edit-product',
		editMode: true,
	});
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

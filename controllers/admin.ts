import { RequestHandler } from 'express';
import Product, { ProductItem } from '../models/product';

export const getProduct: RequestHandler = async (_, res) => {
	try {
		const products = await Product.findAll();

		res.render('admin/products-list', {
			productsList: products ? products : [],
			title: 'Admin Products',
			path: '/admin/products',
		});
	} catch (err) {
		console.log(err);
	}
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

	try {
		await Product.create({
			title,
			price,
			imageUrl,
			description,
		});

		res.redirect('/admin/products');
	} catch (err) {
		console.log(err);
	}
};

export const getEditProduct: RequestHandler = async (req, res) => {
	const productId = req.params.id;

	const searchProduct = await Product.findByPk(productId);

	res.render('admin/edit-product', {
		productToEdit: searchProduct?.dataValues,
		title: `Edit | ${searchProduct?.dataValues?.title}`,
		path: '/admin/edit-product',
		editMode: true,
	});
};

export const postEditProduct: RequestHandler = async (req, res) => {
	const productId = req.params.id;
	const updatedProductData: Omit<ProductItem, 'id'> = req.body;

	const productToEdit = await Product.findByPk(productId);

	productToEdit?.update({
		...productToEdit?.dataValues,
		...updatedProductData,
	});

	await productToEdit?.save();

	res.redirect('/admin/products');
};

export const postDeleteProduct: RequestHandler = async (req, res) => {
	const productId = req.params.id;
	const produtToDelete = await Product.findByPk(productId);
	await produtToDelete?.destroy();

	res.redirect('/admin/products');
};

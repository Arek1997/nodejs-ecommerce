import { RequestHandler } from 'express';
import Product, { ProductInterface } from '../models/product';

export const getProducts: RequestHandler = async (req, res) => {
	const userId = req.session.user;

	const productsList = await Product.find({ userId });

	res.render('admin/products-list', {
		productsList,
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
	const productData: Omit<ProductInterface, 'userId'> = req.body;

	const loggedUser = req.session.user;

	await Product.create({ ...productData, userId: loggedUser });

	res.redirect('/products');
};

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

export const postDeleteProduct: RequestHandler = async (req, res) => {
	const productId = req.params.id;

	try {
		await Product.deleteOne({
			_id: productId,
			userId: req.session.user,
		});

		res.redirect('/admin/products');
	} catch (error) {
		console.log(error);
		res.redirect('/');
	}
};

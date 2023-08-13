import { RequestHandler } from 'express';
import Product, { ProductInterface } from '../models/product';

export const getProducts: RequestHandler = async (_, res) => {
	const productsList = await Product.find();

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

	// const product = new Product({ ...productData, userId: req.user  });
	// await product.save();

	// or

	await Product.create({ ...productData, userId: req.user });

	res.redirect('/products');
};

export const getEditProduct: RequestHandler = async (req, res) => {
	const productId = req.params.id;
	const productToEdit = await Product.findById(productId);

	res.render('admin/edit-product', {
		productToEdit,
		title: `Edit | ${productToEdit?.title}`,
		path: '/admin/edit-product',
		editMode: true,
	});
};

export const postEditProduct: RequestHandler = async (req, res) => {
	const productId = req.params.id;
	const updatedProductData: ProductInterface = req.body;

	await Product.updateOne({ _id: productId }, { ...updatedProductData });

	res.redirect('/admin/products');
};

export const postDeleteProduct: RequestHandler = async (req, res) => {
	const productId = req.params.id;
	await Product.deleteOne({
		_id: productId,
	});

	res.redirect('/admin/products');
};

import { RequestHandler } from 'express';
import Product from '../models/product';

export const getMainPage: RequestHandler = async (_, res) => {
	const response = await Product.fetchAll();

	const latestProduct = response.productsList?.length
		? [response.productsList.at(-1)]
		: [];

	res.render('shop/index', {
		latestProduct,
		title: 'Welcone to out shop!',
		path: '/',
	});
};

export const getProducts: RequestHandler = async (_, res) => {
	const response = await Product.fetchAll();

	res.render('shop/products-list', {
		productsList: response.productsList,
		title: 'All Products',
		path: '/products',
	});
};

export const getProductDetails: RequestHandler = async (req, res) => {
	const productId = req.params.id;

	const searchProduct = await Product.getById(productId);

	if (searchProduct) {
		res.render('shop/product-details', {
			product: searchProduct,
			title: `Product | ${searchProduct.title}`,
			path: '/products',
		});
	} else {
		res.render('shop/product-not-found', {
			title: 'Product | Not Found',
			path: '/products',
		});
	}
};

export const getCart: RequestHandler = (_, res) => {
	res.render('shop/cart', {
		title: 'Your Cart',
		path: '/cart',
	});
};

export const postCart: RequestHandler = async (req, res) => {
	const productId = req.body.id;
	const product = await Product.getById(productId);

	res.redirect('/cart');
};

export const getOrders: RequestHandler = (_, res) => {
	res.render('shop/orders', {
		title: 'Your Orders',
		path: '/orders',
	});
};

export const getCheckout: RequestHandler = (_, res) => {
	res.render('shop/checkout', {
		title: 'Checkout',
		path: '/checkout',
	});
};

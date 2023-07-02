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

export const getProduct: RequestHandler = async (_, res) => {
	const response = await Product.fetchAll();

	res.render('shop/products-list', {
		productsList: response.productsList,
		title: 'All Products',
		path: '/products',
	});
};

export const getCart: RequestHandler = (_, res) => {
	res.render('shop/cart', {
		title: 'Your Cart',
		path: '/cart',
	});
};

export const getCheckout: RequestHandler = (_, res) => {
	res.render('shop/checkout', {
		title: 'Checkout',
		path: '/checkout',
	});
};

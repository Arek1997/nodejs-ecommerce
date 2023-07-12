import { RequestHandler } from 'express';
import Product from '../models/product';
import Cart from '../models/cart';

export const getMainPage: RequestHandler = async (_, res) => {
	const products = await Product.fetchAll();

	const latestProduct = products?.length ? [products.at(-1)] : [];

	res.render('shop/index', {
		latestProduct,
		title: 'Welcone to out shop!',
		path: '/',
	});
};

export const getProducts: RequestHandler = async (_, res) => {
	const products = await Product.fetchAll();

	console.log(products);

	res.render('shop/products-list', {
		productsList: products ? products : [],
		title: 'All Products',
		path: '/products',
	});
};

export const getProductDetails: RequestHandler = async (req, res) => {
	const productId = req.params.id;

	const searchProduct = await Product.getById(productId);

	if (searchProduct) {
		res.render('shop/product-details', {
			product: searchProduct[0],
			title: `Product | ${searchProduct[0].title}`,
			path: '/products',
		});
	} else {
		res.render('shop/product-not-found', {
			title: 'Product | Not Found',
			path: '/products',
		});
	}
};

export const getCart: RequestHandler = async (_, res) => {
	const { items, totalAmount, totalPrice } = await Cart.get();

	const getTitle = (cartLength: number) => {
		if (cartLength === 1) {
			return cartLength + ' item';
		} else if (cartLength > 1) {
			return cartLength + ' items';
		} else {
			return '';
		}
	};

	res.render('shop/cart', {
		cart: items,
		totalPrice,
		totalAmount,
		title: 'Your cart ' + getTitle(totalAmount),
		path: '/cart',
	});
};

export const postCart: RequestHandler = async (req, res) => {
	const productId = req.body.id;

	await Cart.addProduct(productId);

	res.redirect('/cart');
};

export const postRemoveFromCart: RequestHandler = async (req, res) => {
	const productId = req.params.id;

	await Cart.removeProduct(productId);

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

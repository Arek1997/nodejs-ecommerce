import { RequestHandler } from 'express';
import Product from '../models/product';

export const getMainPage: RequestHandler = async (_, res) => {
	const latestProduct = await Product.findOne().sort({ _id: -1 });

	res.render('shop/index', {
		latestProduct,
		title: 'Welcone to out shop!',
		path: '/',
	});
};

export const getProducts: RequestHandler = async (_, res) => {
	const productsList = await Product.find();

	res.render('shop/products-list', {
		productsList,
		title: 'All Products',
		path: '/products',
	});
};

export const getProductDetails: RequestHandler = async (req, res) => {
	const productId = req.params.id;

	const searchProduct = await Product.findById(productId);

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

export const getCart: RequestHandler = async (req, res) => {
	// const cart = (await req.user.getCart()) as ConvertedProductsCart[];

	// const totalPrice = cart
	// 	.reduce((first, next) => first + next.quantity * +next.price, 0)
	// 	.toFixed(2);

	// const totalAmount = cart.reduce((first, next) => first + next.quantity, 0);

	// const getTitle = () => {
	// 	switch (totalAmount) {
	// 		case 0:
	// 			return 'is empty';

	// 		case 1:
	// 			return 'product';

	// 		default:
	// 			return 'products';
	// 	}
	// };

	res.render('shop/cart', {
		// cart,
		// totalPrice,
		// totalAmount,
		// title: `Your cart ${totalAmount || ''} ${getTitle()}`,
		// path: '/cart',
		cart: [],
		totalPrice: 0,
		totalAmount: 0,
		title: `Your cart`,
		path: '/cart',
	});
};

export const postCart: RequestHandler = async (req, res) => {
	const productId = req.body.id;
	const product = await Product.findById(productId);

	await req.user.addToCart(product);

	res.redirect('/cart');
};

export const postRemoveFromCart: RequestHandler = async (req, res) => {
	const productId = req.params.id;
	await req.user.removeFromCart(productId);

	res.redirect('/cart');
};

export const getOrders: RequestHandler = async (req, res) => {
	// const orders = await req.user.getOrders();

	res.render('shop/orders', {
		// title: 'Your Orders',
		// path: '/orders',
		// orders,
		title: 'Your Orders',
		path: '/orders',
		orders: [],
	});
};

export const postOrder: RequestHandler = async (req, res) => {
	await req.user.addOrder();
	res.redirect('/orders');
};

export const getCheckout: RequestHandler = (_, res) => {
	res.render('shop/checkout', {
		title: 'Checkout',
		path: '/checkout',
	});
};

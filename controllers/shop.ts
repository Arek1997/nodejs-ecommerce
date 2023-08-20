import { RequestHandler } from 'express';
import Product from '../models/product';
import Order from '../models/order';

export const getMainPage: RequestHandler = async (req, res) => {
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
	try {
		const cart = await req.session.user
			.populate('cart.items.productId')
			.then((products: any) => products.cart.items);

		const totalPrice = cart
			.reduce(
				(first: number, next: any) =>
					first + next.quantity * +next.productId.price,
				0
			)
			.toFixed(2);

		const totalAmount = cart.reduce(
			(first: number, next: any) => first + next.quantity,
			0
		);

		const getTitle = () => {
			switch (totalAmount) {
				case 0:
					return 'is empty';

				case 1:
					return 'product';

				default:
					return 'products';
			}
		};

		res.render('shop/cart', {
			cart,
			totalPrice,
			totalAmount,
			title: `Your cart ${totalAmount || ''} ${getTitle()}`,
			path: '/cart',
		});
	} catch (err) {
		console.log(err);
	}
};

export const postCart: RequestHandler = async (req, res) => {
	const productId = req.body.id;
	const product = await Product.findById(productId);

	console.log(req.session);

	await req.session.user.addToCart(product);

	res.redirect('/cart');
};

export const postRemoveFromCart: RequestHandler = async (req, res) => {
	try {
		const productId = req.params.id;
		await req.session.user.removeFromCart(productId);

		res.redirect('/cart');
	} catch (err) {
		console.log(err);
	}
};

export const getOrders: RequestHandler = async (req, res) => {
	const orders = await Order.find({ 'user._id': req.session.user._id });

	res.render('shop/orders', {
		title: 'Your Orders',
		path: '/orders',
		orders,
	});
};

export const postOrder: RequestHandler = async (req, res) => {
	const { email, _id } = req.session.user;

	const products = await req.session.user
		.populate('cart.items.productId')
		.then((products: any) =>
			products.cart.items.map((item: any) => {
				return { ...item.productId._doc, quantity: item.quantity };
			})
		);

	await Order.create({
		user: {
			email,
			_id,
		},
		products,
	});

	await req.session.user.clearCart();

	res.redirect('/orders');
};

export const getCheckout: RequestHandler = (_, res) => {
	res.render('shop/checkout', {
		title: 'Checkout',
		path: '/checkout',
	});
};

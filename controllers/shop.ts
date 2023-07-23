import { RequestHandler } from 'express';
import Product from '../models/product';

export const getMainPage: RequestHandler = async (_, res) => {
	const products = await Product.findAll();

	const latestProduct = products?.length ? [products.at(-1)] : [];

	res.render('shop/index', {
		latestProduct,
		title: 'Welcone to out shop!',
		path: '/',
	});
};

export const getProducts: RequestHandler = async (_, res) => {
	const products = await Product.findAll();

	res.render('shop/products-list', {
		productsList: products ? products : [],
		title: 'All Products',
		path: '/products',
	});
};

export const getProductDetails: RequestHandler = async (req, res) => {
	const productId = req.params.id;

	const searchProduct = await Product.findByPk(productId);

	if (searchProduct) {
		res.render('shop/product-details', {
			product: searchProduct.dataValues,
			title: `Product | ${searchProduct.dataValues.title}`,
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
	const cart = await req.user.getCart();
	const products = await cart.getProducts();

	const getTitle = (cartLength: number) => {
		if (cartLength === 1) {
			return cartLength + ' item';
		} else if (cartLength > 1) {
			return cartLength + ' items';
		} else {
			return '';
		}
	};

	const totalAmount = products.reduce(
		(acc: any, curr: any) => acc + curr.cartItem.quantity,
		0
	);

	const totalPrice = products
		.reduce(
			(acc: any, curr: any) => acc + curr.cartItem.quantity * curr.price,
			0
		)
		.toFixed(2);

	res.render('shop/cart', {
		cart: products,
		totalPrice,
		totalAmount,
		title: 'Your cart ' + getTitle(totalAmount),
		path: '/cart',
	});
};

export const postCart: RequestHandler = async (req, res) => {
	const productId = req.body.id;
	const cart = await req.user.getCart();
	const productsList = await cart.getProducts({ where: { id: productId } });

	let product;
	if (productsList.length) {
		product = productsList[0];
	}

	let newQuantity = 1;

	if (product) {
		const oldQuantity = product.cartItem.quantity;
		newQuantity = oldQuantity + 1;

		cart.addProduct(product, { through: { quantity: newQuantity } });
	} else {
		const product = await Product.findByPk(productId);
		cart.addProduct(product, { through: { quantity: newQuantity } });
	}

	res.redirect('/cart');
};

export const postRemoveFromCart: RequestHandler = async (req, res) => {
	const productId = req.params.id;

	const cart = await req.user.getCart();
	const [productToRemove] = await cart.getProducts({
		where: { id: productId },
	});

	await productToRemove.cartItem.destroy();

	res.redirect('/cart');
};

export const getOrders: RequestHandler = async (req, res) => {
	const orders = await req.user.getOrders({ include: ['products'] });
	console.log('orders', orders);

	res.render('shop/orders', {
		title: 'Your Orders',
		path: '/orders',
		orders,
	});
};

export const postOrder: RequestHandler = async (req, res) => {
	const cart = await req.user.getCart();
	const products = await cart.getProducts();
	const order = await req.user.createOrder();

	await order.addProducts(
		products.map((product: any) => {
			product.orderItem = {
				quantity: product.cartItem.quantity,
			};

			return product;
		})
	);

	await cart.setProducts(null);

	res.redirect('/orders');
};

export const getCheckout: RequestHandler = (_, res) => {
	res.render('shop/checkout', {
		title: 'Checkout',
		path: '/checkout',
	});
};

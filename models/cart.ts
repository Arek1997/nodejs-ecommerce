import Product, { ProductItem } from './product';
import fs from 'fs';
import path from 'path';
import { rootPath } from '../utils';

interface CartInterface {
	items: ProductInCart[];
	totalPrice: number;
	totalAmount: number;
}

interface ProductInCart extends ProductItem {
	amount: number;
}

const cartPath = path.join(rootPath, 'data', 'cart.json');

const getCart = async () => {
	try {
		const cart: CartInterface = await new Promise((resolve, reject) => {
			fs.readFile(path.join(cartPath), (err, data) => {
				if (err) {
					console.log('err', err);
					reject(err);
				} else {
					const cart = JSON.parse(data.toString());
					resolve(cart);
				}
			});
		});

		return cart;
	} catch (err) {
		console.log(err);
	}
};

const addProductToCart = async (cart: CartInterface, productId: string) => {
	const productExist = cart.items.some((product) => product.id === productId);

	if (productExist) {
		const existingProduct = cart.items.find((item) => item.id === productId)!;
		existingProduct.amount++;
	} else {
		const product = await Product.getById(productId);
		cart.items = [...cart.items, { ...product!, amount: 1 }];
	}

	cart.totalAmount++;
	const totalPrice = cart.items.reduce(
		(prev, curr) => prev + Number(curr.price) * curr.amount,
		0
	);

	cart.totalPrice = +totalPrice.toFixed(2);
	try {
		await new Promise((resolve, reject) => {
			fs.writeFile(cartPath, JSON.stringify(cart), (err) => {
				if (err) {
					console.log('writeFileErr', err);
					reject(err);
				} else {
					resolve('Product added to cart');
				}
			});
		});
	} catch (err) {
		console.log(err);
	}
};

const removeProductFromCart = async (
	cart: CartInterface,
	productId: string
) => {
	const productExist = cart.items.some((product) => product.id === productId);

	if (!productExist) {
		return console.log('Product does not exist');
	}

	const productToRemove = cart.items.find((item) => item.id === productId)!;
	const updatedCart = {
		...cart,
		items: cart.items.filter((item) => item.id !== productId),
	};

	updatedCart.totalAmount -= productToRemove.amount;
	updatedCart.totalPrice = +updatedCart.items
		.reduce((prev, curr) => prev + Number(curr.price) * curr.amount, 0)
		.toFixed(2);

	try {
		await new Promise((resolve, reject) => {
			fs.writeFile(cartPath, JSON.stringify(updatedCart), (err) => {
				if (err) {
					console.log('writeFileErr', err);
					reject(err);
				} else {
					console.log(`Product with id: ${productId} removed from cart`);
					resolve('Product removed from cart');
				}
			});
		});
	} catch (err) {
		console.log(err);
	}
};

export default class Cart {
	static async addProduct(productId: string) {
		const cart = await getCart();
		await addProductToCart(cart!, productId);
	}

	static async removeProduct(productId: string) {
		const cart = await getCart();
		await removeProductFromCart(cart!, productId);
	}

	static async get() {
		const cart = await getCart();

		return cart!;
	}

	static async getTotalPrice() {
		const cart = await getCart();

		return cart!.totalPrice;
	}

	static async getTotalAmount() {
		const cart = await getCart();

		return cart!.totalAmount;
	}
}

import { ObjectId } from 'mongodb';
import { getMongoDataBase } from '../libs/database';
import { ProductItem } from './product';

interface Cart {
	items: { productId: ObjectId; quantity: number }[];
}

export interface ConvertedProductsCart extends ProductItem {
	quantity: number;
}

export interface UserInterface {
	_id: ObjectId;
	name: string;
	email: string;
	cart: Cart;
}

class User implements UserInterface {
	_id: ObjectId;
	name: string;
	email: string;
	cart: Cart;

	constructor(name: string, email: string, cart: Cart, _id: ObjectId) {
		this._id = _id;
		this.name = name;
		this.email = email;
		this.cart = cart;
	}

	async save() {
		try {
			await getMongoDataBase().collection('users').insertOne(this);
		} catch (err) {
			console.log(err);
		}
	}

	async getCart() {
		const IDsArray = this.cart.items.map((item) => item.productId);

		try {
			const products = await getMongoDataBase()
				.collection('products')
				.find({ _id: { $in: IDsArray } })
				.toArray();

			const cartItemsArray = products.map((product) => {
				const cartItemQuantity = this.cart.items.find(
					(item) => item.productId.toString() === product._id.toString()
				)?.quantity;

				return {
					...product,
					id: product._id.toString(),
					quantity: cartItemQuantity,
				};
			}) as ConvertedProductsCart[];

			return cartItemsArray;
		} catch (err) {
			console.log(err);
		}
	}

	async addToCart(product: ProductItem) {
		const cartProductIndex = this.cart?.items?.findIndex(
			(item) => item.productId.toString() === product._id.toString()
		);
		const updatedCartItems = [...this.cart.items];

		if (cartProductIndex < 0) {
			const newCartProduct = { productId: product._id, quantity: 1 };
			updatedCartItems.push(newCartProduct);
		} else {
			updatedCartItems[cartProductIndex].quantity += 1;
		}

		try {
			await getMongoDataBase()
				.collection('users')
				.updateOne(
					{ _id: this._id },
					{
						$set: { cart: { items: updatedCartItems } },
					}
				);
		} catch (err) {
			console.log(err);
		}
	}

	async removeFromCart(id: string) {
		const updatedCartItems = this.cart.items.filter(
			(item) => item.productId.toString() !== new ObjectId(id).toString()
		);

		try {
			await getMongoDataBase()
				.collection('users')
				.updateOne(
					{ _id: this._id },
					{
						$set: { cart: { items: updatedCartItems } },
					}
				);
		} catch (err) {
			console.log(err);
		}
	}

	static async findById(userId: string) {
		try {
			const user = await getMongoDataBase()
				.collection('users')
				.findOne({ _id: new ObjectId(userId) });

			return user;
		} catch (err) {
			console.log(err);
		}
	}

	async getOrders() {
		const orders = await getMongoDataBase()
			.collection('orders')
			.find({ 'user._id': this._id })
			.toArray();

		return orders;
	}

	async addOrder() {
		try {
			const cartProducts = await this.getCart();

			const order = {
				user: {
					_id: this._id,
					name: this.name,
				},
				items: cartProducts,
			};

			await getMongoDataBase().collection('orders').insertOne(order);

			this.cart = { items: [] };

			await getMongoDataBase()
				.collection('users')
				.updateOne(
					{ _id: this._id },
					{
						$set: { cart: { items: [] } },
					}
				);
		} catch (err) {
			console.log(err);
		}
	}
}

export default User;

import { ObjectId } from 'mongodb';
import { getMongoDataBase } from '../libs/database';
import { ProductItem } from './product';

class User {
	private name: string;
	private email: string;
	private cart: { items: ProductItem[] }; // {items: []}

	constructor(name: string, email: string, cart: any) {
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

	async addToCart(product: Omit<ProductItem, '_id' | 'id'>) {}

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
}

export default User;

import crypto from 'crypto';
import Cart from './cart';
import db from '../libs/database';

export interface ProductItem {
	id: string;
	title: string;
	imageUrl: string;
	description: string;
	price: string;
}
interface Response {
	productsList: ProductItem[];
	message: string;
}

export default class Product {
	readonly id: string;

	constructor(
		readonly title: string,
		readonly imageUrl: string,
		readonly description: string,
		readonly price: string
	) {
		this.title = title;
		this.imageUrl = imageUrl;
		this.description = description;
		this.price = price;
		this.id = crypto.randomBytes(20).toString('hex');
	}

	async save() {
		try {
			await db.execute(
				'INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)',
				[this.title, this.price, this.description, this.imageUrl]
			);
		} catch (err) {
			console.log(err);
		}
	}

	static async edit(
		searchProductId: string,
		newData: Omit<ProductItem, 'id'>
	) {}

	static async fetchAll() {
		try {
			const [products] = await db.execute('SELECT * FROM products');

			return products as ProductItem[];
		} catch (err) {
			console.log(err);
		}
	}

	static async getById(id: string) {
		try {
			const [products] = await db.execute('SELECT * FROM products WHERE id=?', [
				id,
			]);

			return products as ProductItem[];
		} catch (err) {
			console.log(err);
		}
	}

	static async remove(id: string) {}
}

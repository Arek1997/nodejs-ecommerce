import { ObjectId } from 'mongodb';
import { getMongoDataBase } from '../libs/database';

export interface ProductItem {
	_id: ObjectId;
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

class Product {
	private title: string;
	private price: string;
	private description: string;
	private imageUrl: string;

	constructor(
		title: string,
		price: string,
		description: string,
		imageUrl: string
	) {
		this.title = title;
		this.price = price;
		this.description = description;
		this.imageUrl = imageUrl;
	}

	async save() {
		try {
			const result = await getMongoDataBase()
				.collection('products')
				.insertOne(this);

			console.log(result);
		} catch (err) {
			console.log(err);
		}
	}

	static async fetchAll() {
		try {
			const result = await getMongoDataBase()
				.collection('products')
				.find()
				.toArray();

			const productsWithId = result.map((item) => ({
				...item,
				id: item._id.toString(),
			})) as ProductItem[];

			return productsWithId;
		} catch (err) {
			console.log(err);
		}
	}

	static async getById(id: string) {
		try {
			const result = await getMongoDataBase()
				.collection('products')
				.find({ _id: new ObjectId(id) })
				.toArray();

			const productsWithId = result.map((item) => ({
				...item,
				id: item._id.toString(),
			})) as ProductItem[];

			return productsWithId;
		} catch (err) {
			console.log(err);
		}
	}
}

export default Product;

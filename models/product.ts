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
	private userId: string;

	constructor(
		title: string,
		price: string,
		description: string,
		imageUrl: string,
		userId?: string
	) {
		this.title = title;
		this.price = price;
		this.description = description;
		this.imageUrl = imageUrl;
		this.userId = userId || '';
	}

	async save() {
		try {
			await getMongoDataBase().collection('products').insertOne(this);

			console.log('You successfully created product.');
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
				.next();

			const productsWithId = {
				...result,
				id: result?._id.toString(),
			} as ProductItem;

			return productsWithId;
		} catch (err) {
			console.log(err);
		}
	}

	static async update(
		productId: string,
		newData: Omit<ProductItem, '_id' | 'id'>
	) {
		try {
			await getMongoDataBase()
				.collection('products')
				.updateOne(
					{ _id: new ObjectId(productId) },
					{
						$set: newData,
					}
				);

			console.log('You successfully updated product.');
		} catch (err) {
			console.log(err);
		}
	}

	static async remove(productId: string) {
		try {
			await getMongoDataBase()
				.collection('products')
				.deleteOne({ _id: new ObjectId(productId) });

			console.log('You successfully removed product.');
		} catch (err) {
			console.log(err);
		}
	}
}

export default Product;

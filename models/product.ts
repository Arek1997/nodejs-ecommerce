import fs from 'fs';
import path from 'path';
import { rootPath } from '../utils';
import crypto from 'crypto';
import Cart from './cart';

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

const productsPath = path.join(rootPath, 'data', 'products.json');

const getProductsFromFile = (callback: (response: Response) => void) => {
	fs.readFile(productsPath, (err, fileContent) => {
		let response: Response;

		if (err) {
			response = { productsList: [], message: 'No data' };
		} else {
			response = {
				productsList: JSON.parse(fileContent.toString()),
				message: '',
			};
		}

		callback(response);
	});
};

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
		this.save();
	}

	save() {
		getProductsFromFile(async ({ productsList }) => {
			productsList.push(this);

			fs.writeFile(productsPath, JSON.stringify(productsList), (err) => {
				console.log('writeFileErr', err);
			});
		});
	}

	static async edit(searchProductId: string, newData: Omit<ProductItem, 'id'>) {
		try {
			await new Promise((resolve, reject) =>
				getProductsFromFile(({ productsList }) => {
					const indexofEditedProduct = productsList.findIndex(
						(product) => product.id === searchProductId
					);

					const productToEdit = productsList[indexofEditedProduct];

					const updatedProduct = { ...productToEdit, ...newData };

					productsList[indexofEditedProduct] = updatedProduct;

					fs.writeFile(productsPath, JSON.stringify(productsList), (err) => {
						if (err) {
							console.log('edit writeFileErr', err);
							reject(err);
						} else {
							console.log(`Product with id: ${searchProductId} updated`);
							resolve(`Product with id: ${searchProductId} updated`);
						}
					});
				})
			);
		} catch (err) {
			console.log(err);
		}
	}

	static async fetchAll() {
		try {
			const response: Response = await new Promise((resolve, reject) =>
				getProductsFromFile((data) => {
					const { productsList, message } = data;

					if (productsList.length) {
						resolve(data);
					} else {
						reject(message);
					}
				})
			);

			return response;
		} catch (err) {
			console.log(err);
			return {
				productsList: null,
				message: err as string,
			};
		}
	}

	static async getById(id: string) {
		try {
			const product: ProductItem = await new Promise((resolve, reject) =>
				getProductsFromFile(({ productsList }) => {
					const searchProduct = productsList.find(
						(product) => product.id === id
					);

					if (searchProduct) {
						resolve(searchProduct);
					} else {
						reject(`Not found any product with id: ${id}`);
					}
				})
			);

			return product;
		} catch (err) {
			console.log(err);
		}
	}

	static async remove(id: string) {
		try {
			await new Promise((resolve, reject) =>
				getProductsFromFile((data) => {
					const { productsList } = data;

					const updatedProductList = productsList.filter(
						(product) => product.id !== id
					);

					fs.writeFile(
						productsPath,
						JSON.stringify(updatedProductList),
						async (err) => {
							if (err) {
								console.log('edit writeFileErr', err);
								reject(err);
							} else {
								console.log(`Product with id: ${id} removed`);
								resolve(`Product with id: ${id} removed`);
							}
						}
					);
				})
			);
			await Cart.removeProduct(id);
		} catch (err) {
			console.log(err);
		}
	}
}

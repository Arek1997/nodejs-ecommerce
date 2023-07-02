import fs from 'fs';
import path from 'path';
import { rootPath } from '../utils';

type ProductItem = { title: string };
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
		this.save();
	}

	save() {
		getProductsFromFile(({ productsList }) => {
			productsList.push(this);

			fs.writeFile(productsPath, JSON.stringify(productsList), (err) => {
				console.log('writeFileErr', err);
			});
		});
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
}

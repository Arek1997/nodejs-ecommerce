import { ProductItem } from './product';

export default class Cart {
	private cartArr: ProductItem[];
	private totalPrice: number;

	constructor() {
		this.cartArr = [];
		this.totalPrice = 0;
	}

	async addProduct(product: ProductItem) {
		this.cartArr.push(product);
	}

	getProducts() {
		return this.cartArr;
	}

	getProductsAmount() {
		return this.cartArr.length;
	}
}

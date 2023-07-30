import { Schema, model } from 'mongoose';

export interface ProductInterface {
	title: string;
	price: string;
	imageUrl: string;
	description: string;
}

const productSchema = new Schema<ProductInterface>({
	title: { type: String, required: true },
	price: { type: String, required: true },
	imageUrl: { type: String, required: true },
	description: { type: String, required: true },
});

const Product = model<ProductInterface>('Product', productSchema);

export default Product;

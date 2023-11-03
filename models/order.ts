import { Schema, Types, model, Document } from 'mongoose';
import { ProductInterface } from './product';

interface Order extends Document {
	user: {
		_id: Types.ObjectId;
		email: string;
	};

	products: Array<ProductInterface & { quantity: number }>;
}

const orderSchema = new Schema<Order>({
	user: {
		_id: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},

		email: {
			type: String,
			required: true,
		},
	},

	products: [
		{
			type: Object,
			required: true,
			quantity: { type: Number, required: true },
		},
	],
});

const Order = model<Order>('Order', orderSchema);

export default Order;

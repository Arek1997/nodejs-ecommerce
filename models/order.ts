import { Schema, Types, model, Document } from 'mongoose';

interface Order extends Document {
	user: {
		_id: Types.ObjectId;
		name: string;
	};

	products: {
		product: object;
		quantity: number;
	}[];
}

const orderSchema = new Schema<Order>({
	user: {
		_id: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},

		name: {
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

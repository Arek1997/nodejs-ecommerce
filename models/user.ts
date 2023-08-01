import { Schema, Types, model } from 'mongoose';

interface UserInterface {
	name: string;
	email: string;
	cart: {
		items: {
			productId: Types.ObjectId;
			quantity: number;
		}[];
	};
}

const userSchema = new Schema<UserInterface>({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	cart: {
		items: [
			{
				productId: {
					type: Schema.Types.ObjectId,
					required: true,
					ref: 'Product',
				},
				quantity: { type: Number, required: true },
			},
		],
	},
});

const User = model<UserInterface>('User', userSchema);

export default User;

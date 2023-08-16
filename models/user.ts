import { Model, Schema, Types, model, Document } from 'mongoose';
import { ProductInterface } from './product';
import { ObjectId } from 'mongodb';

export interface UserInterface extends Document {
	email: string;
	password: string;
	cart: {
		items: {
			productId: Types.ObjectId;
			quantity: number;
		}[];
	};
}

export interface UserMethods extends UserInterface {
	addToCart(product: ProductInterface & { _id: Types.ObjectId }): Promise<void>;
	removeFromCart(productId: string): Promise<void>;
	clearCart(): Promise<void>;
}

export type UserModel = Model<UserInterface, {}, UserMethods>;

const userSchema = new Schema<UserInterface, UserModel, UserMethods>({
	email: {
		type: String,
		required: true,
	},
	password: {
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

userSchema.methods.addToCart = async function (product) {
	const cartProductIndex = this.cart?.items?.findIndex(
		(item) => item.productId.toString() === product._id.toString()
	);

	const updatedCartItems = [...this.cart.items];

	if (cartProductIndex < 0) {
		const newCartProduct = { productId: product._id, quantity: 1 };
		updatedCartItems.push(newCartProduct);
	} else {
		updatedCartItems[cartProductIndex].quantity += 1;
	}

	this.cart.items = updatedCartItems;

	try {
		await this.save();
	} catch (err) {
		console.log(err);
	}
};

userSchema.methods.removeFromCart = async function (productId) {
	const updatedCartItems = this.cart.items.filter(
		(item) => item.productId.toString() !== new ObjectId(productId).toString()
	);

	this.cart.items = updatedCartItems;

	try {
		this.save();
	} catch (err) {
		console.log(err);
	}
};

userSchema.methods.clearCart = async function () {
	this.cart = { items: [] };

	try {
		await this.save();
	} catch (err) {
		console.log(err);
	}
};

const User = model<UserInterface, UserModel>('User', userSchema);

export default User;

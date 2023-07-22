import { DataTypes } from 'sequelize';
import sequelize from '../libs/database';

import { ProductItem } from './product';

interface CartInterface {
	items: ProductInCart[];
	totalPrice: number;
	totalAmount: number;
}

interface ProductInCart extends ProductItem {
	amount: number;
}

const Cart = sequelize.define('cart', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
});

export default Cart;

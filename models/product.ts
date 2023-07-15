import { DataTypes } from 'sequelize';
import sequelize from '../libs/database';

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

const Product = sequelize.define('product', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},

	title: DataTypes.STRING,

	price: {
		type: DataTypes.DOUBLE,
		allowNull: false,
	},

	imageUrl: {
		type: DataTypes.STRING,
		allowNull: false,
	},

	description: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

export default Product;

require('dotenv').config();

import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
	'node_complete',
	'root',
	process.env.MYSQL_DB_PASSWORD,
	{ dialect: 'mysql', host: 'localhost' }
);

export default sequelize;

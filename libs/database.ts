import mysql from 'mysql2';

const connectionPool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	database: 'node_complete',
	password: 'zaq1@WSX',
});

export default connectionPool.promise();

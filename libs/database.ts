require('dotenv').config();

import { MongoClient } from 'mongodb';

const encodedPassword = encodeURIComponent(`${process.env.MONGODB_PASSWORD}`);

const URL = `mongodb+srv://${process.env.MONGODB_USERNAME}:${encodedPassword}@cluster0.eivaqqu.mongodb.net/?retryWrites=true&w=majority`;

let client: MongoClient | null = null;

const mongoConnect = async () => {
	try {
		client = await MongoClient.connect(URL);

		console.log('You successfully connected to MongoDB!');
	} catch (err) {
		console.log(err);
	}
};

export const getMongoClient = () => {
	if (client) {
		return client;
	}

	throw new Error('No Client found!');
};

export const getMongoDataBase = () => {
	if (client) {
		return client.db();
	}

	throw new Error('No DataBase found!');
};

export default mongoConnect;

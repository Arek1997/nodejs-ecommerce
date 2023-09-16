import mongoose from 'mongoose';
import { MONGODB_URL } from '../utils/mongoDb';

const connectMongoose = async (callback: () => void) => {
	try {
		await mongoose.connect(MONGODB_URL);
		callback();
	} catch (err) {
		console.log(err);
	}
};

export default connectMongoose;

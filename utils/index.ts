require('dotenv').config();

const encodedPassword = encodeURIComponent(`${process.env.MONGODB_PASSWORD}`);

export const MONGODB_URL = `mongodb+srv://${process.env.MONGODB_USERNAME}:${encodedPassword}@cluster0.eivaqqu.mongodb.net/shop?retryWrites=true&w=majority`;

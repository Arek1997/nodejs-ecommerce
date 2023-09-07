import 'dotenv/config';
import Mailjet from 'node-mailjet';

const mailjet = new Mailjet({
	apiKey: process.env.MAILJET_PUBLIC_APIKEY,
	apiSecret: process.env.MAILJET_PRIVATE_APIKEY,
});

export default mailjet;

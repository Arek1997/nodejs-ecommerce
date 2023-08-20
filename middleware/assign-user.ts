import { RequestHandler } from 'express';
import User from '../models/user';

const assignUserMiddleware: RequestHandler = async (req, _, next) => {
	try {
		if (req.session.isLoggedIn) {
			req.session.user = User.hydrate(req.session.user);
		}
	} catch (err) {
		console.log(err);
	} finally {
		next();
	}
};

export default assignUserMiddleware;

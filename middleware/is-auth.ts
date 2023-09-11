import { RequestHandler } from 'express';

const isAuth: RequestHandler = (req, res, next) => {
	if (req.session.isLoggedIn) {
		next();
	} else {
		res.redirect('/login');
	}
};
export default isAuth;

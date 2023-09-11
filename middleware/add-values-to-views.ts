import { RequestHandler } from 'express';

const addValuesToViews: RequestHandler = (req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();
	res.locals.inputs = null;

	next();
};

export default addValuesToViews;

import { RequestHandler } from 'express';

const addValuesToViews: RequestHandler = (req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();

	next();
};

export default addValuesToViews;

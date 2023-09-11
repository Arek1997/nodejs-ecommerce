import { RequestHandler } from 'express';

export const getLogin: RequestHandler = (req, res) => {
	const [errorMessage] = req.flash('error-message');

	if (req.session.isLoggedIn) {
		res.redirect('/');
	} else {
		res.render('auth/login', {
			title: 'Login',
			path: '/login',
			errorMessage,
		});
	}
};

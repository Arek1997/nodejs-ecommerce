import { RequestHandler } from 'express';

export const getSignup: RequestHandler = (req, res) => {
	const [errorMessage] = req.flash('error-message');

	if (req.session.isLoggedIn) {
		res.redirect('/');
	} else {
		res.render('auth/signup', {
			title: 'Signup',
			path: '/signup',
			errorMessage,
		});
	}
};

import { RequestHandler } from 'express';

export const getPasswordReset: RequestHandler = (req, res) => {
	const [errorMessage] = req.flash('error-message');
	const [successMessage] = req.flash('success-message');

	if (req.session.isLoggedIn) {
		res.redirect('/');
	} else {
		res.render('auth/password-reset', {
			title: 'Password Reset',
			path: '/password-reset',
			flashMessage: {
				message: errorMessage || successMessage,
				type: errorMessage ? 'error' : successMessage ? 'success' : '',
			},
		});
	}
};

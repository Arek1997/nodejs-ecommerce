import { RequestHandler } from 'express';

export const getChangePassword: RequestHandler = async (req, res) => {
	const [errorMessage] = req.flash('error-message');
	const [successMessage] = req.flash('success-message');

	const { token } = req.params;
	const { forget: forgetPassword } = req.query;

	res.render('auth/change-password', {
		title: 'Change Password',
		path: '/change-password',
		token,
		forgetPassword,
		flashMessage: {
			message: errorMessage || successMessage,
			type: errorMessage ? 'error' : successMessage ? 'success' : '',
		},
	});
};

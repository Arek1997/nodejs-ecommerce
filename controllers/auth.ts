import { RequestHandler } from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';
import { passwordResetHandler, signupHandler } from '../utils/mailjet';
import crypto from 'crypto';

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

export const postLogin: RequestHandler = async (req, res) => {
	const { email, password } = req.body as { email: string; password: string };

	try {
		const userAssignedToEmail = await User.findOne({ email });

		if (!userAssignedToEmail) {
			throw new Error('Invalid email or password was provided.');
		}

		const isPasswordCorrect = await bcrypt.compare(
			password,
			userAssignedToEmail?.password!
		);

		if (!isPasswordCorrect) {
			throw new Error('Invalid email or password was provided.');
		}

		await userAssignedToEmail.updateOne({
			resetToken: null,
			resetTokenExpiration: null,
		});

		req.session.isLoggedIn = true;
		req.session.user = userAssignedToEmail;
		req.session.save(() => res.redirect('/'));
	} catch (error: any) {
		console.log(error);
		req.flash('error-message', error.message);
		res.redirect('/login');
	}
};

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

export const postSignup: RequestHandler = async (req, res) => {
	try {
		const { email, password, confirmPassword } = req.body as {
			email: string;
			password: string;
			confirmPassword: string;
		};

		const emailExist = await User.findOne({ email });

		if (emailExist) {
			throw new Error('This email already exist.');
		}

		if (password !== confirmPassword) {
			throw new Error('Passwords are not the same.');
		}

		const hashedPassword = await bcrypt.hash(password, 15);
		const newUser = await User.create({
			email,
			password: hashedPassword,
			cart: {
				items: [],
			},
		});

		req.session.isLoggedIn = true;
		req.session.user = newUser;

		req.session.save(() => {
			res.redirect('/');
			signupHandler(email);
		});
	} catch (error: any) {
		console.log(error);
		req.flash('error-message', error.message);
		return res.redirect('/signup');
	}
};

export const postLogout: RequestHandler = (req, res) => {
	req.session.destroy(() => res.redirect('/login'));
};

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

export const postPasswordReset: RequestHandler = async (req, res) => {
	const { email: providedEmail } = req.body as { email: string };
	crypto.randomBytes(32, async (err, buffer) => {
		try {
			if (err) {
				console.log(err);
				throw new Error('Some error occurred, try again later.');
			}

			const token = buffer.toString('hex');
			const user = await User.findOne({ email: providedEmail });

			if (!user) {
				throw new Error('The account assigned to this email was not found.');
			}

			await user.updateOne({
				resetToken: token,
				resetTokenExpiration: Date.now() + 3600000, // time from now + 1h extra
			});

			passwordResetHandler(providedEmail, token, true);

			req.flash(
				'success-message',
				'A message with reset password link has been send to this email.'
			);
		} catch (error: any) {
			console.log(error);
			req.flash('error-message', error.message);
		} finally {
			res.redirect('/password-reset');
		}
	});
};

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

export const postChangePassword: RequestHandler = async (req, res) => {
	const { current_password, new_password } = req.body as {
		current_password: string;
		new_password: string;
	};

	const { token } = req.params;
	const { forget: forgetPassword } = req.query;

	try {
		const user = await User.findOne({
			resetToken: token,
			resetTokenExpiration: { $gt: Date.now() },
		});

		if (!user) {
			throw new Error('Token expired or is invalid.');
		}

		const { password: current_hashed_password } = user;

		if (!forgetPassword) {
			const isCurrentPasswordCorrect = await bcrypt.compare(
				current_password,
				current_hashed_password
			);

			if (!isCurrentPasswordCorrect) {
				throw new Error('Current password is not correct.');
			}
		}

		const arePasswordsTheSame = await bcrypt.compare(
			new_password,
			current_hashed_password
		);

		if (arePasswordsTheSame) {
			throw new Error('Passwords are the same.');
		}

		const newHashedPassword = await bcrypt.hash(new_password, 15);
		await user.updateOne({
			password: newHashedPassword,
			resetToken: null,
			resetTokenExpiration: null,
		});

		req.flash('success-message', 'Password has been reset.');
	} catch (error: any) {
		console.log(error);
		req.flash('error-message', error.message);
	} finally {
		res.redirect(
			`/change-password/${token || ''}${
				forgetPassword ? `/?forget=${forgetPassword}` : ''
			}`
		);
	}
};

import { RequestHandler } from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';
import { signupHandler } from '../utils/mailjet';

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
			req.flash('error-message', 'Invalid email or password was provided.');
			return res.redirect('/login');
		}

		const isPasswordCorrect = await bcrypt.compare(
			password,
			userAssignedToEmail?.password!
		);

		if (isPasswordCorrect) {
			req.session.isLoggedIn = true;
			req.session.user = userAssignedToEmail;

			req.session.save(() => res.redirect('/'));
		} else {
			req.flash('error-message', 'Invalid email or password was provided.');
			res.redirect('/login');
		}
	} catch (err) {
		console.log(err);
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
			req.flash('error-message', 'This email already exist.');
			return res.redirect('/signup');
		}

		if (password !== confirmPassword) {
			req.flash('error-message', 'Passwords are not the same.');
			return res.redirect('/signup');
		}

		const hashedPassword = await bcrypt.hash(password, 15);

		User.create({
			email,
			password: hashedPassword,
			cart: {
				items: [],
			},
		});

		res.redirect('/login');
		signupHandler(email);
	} catch (err) {
		console.log(err);
	}
};

export const postLogout: RequestHandler = (req, res) => {
	req.session.destroy(() => res.redirect('/login'));
};

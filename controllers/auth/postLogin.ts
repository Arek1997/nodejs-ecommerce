import { RequestHandler } from 'express';
import User from '../../models/user';
import bcrypt from 'bcrypt';
import isEmail from 'validator/lib/isEmail';

export const postLogin: RequestHandler = async (req, res) => {
	const { email, password } = req.body as { email: string; password: string };

	const trimmedPassword = password.trim();

	try {
		if (!isEmail(email)) {
			throw new Error('This email is not correct.');
		}

		const userAssignedToEmail = await User.findOne({ email });

		if (!userAssignedToEmail) {
			throw new Error('Invalid email or password was provided.');
		}

		const isPasswordCorrect = await bcrypt.compare(
			trimmedPassword,
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

		res.status(422).render('auth/login', {
			title: 'Login',
			path: '/login',
			errorMessage: error.message,
			inputs: {
				email,
				password,
			},
		});
	}
};

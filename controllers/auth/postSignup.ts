import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import isEmail from 'validator/lib/isEmail';
import normalizeEmail from 'validator/lib/normalizeEmail';
import User from '../../models/user';
import { signupHandler } from '../../utils/mailjet';

export const postSignup: RequestHandler = async (req, res) => {
	const { email, password, confirmPassword } = req.body as {
		email: string;
		password: string;
		confirmPassword: string;
	};

	const normalizedEmail = normalizeEmail(email);
	const trimmedPassword = password.trim();
	const trimmedConfirmPassword = confirmPassword.trim();

	try {
		if (!isEmail(normalizedEmail as string)) {
			throw new Error('This email is not correct.');
		}

		const emailExist = await User.findOne({ email: normalizedEmail });

		if (emailExist) {
			throw new Error('This email already exist.');
		}

		if (trimmedPassword !== trimmedConfirmPassword) {
			throw new Error('Passwords are not the same.');
		}

		const hashedPassword = await bcrypt.hash(trimmedPassword, 15);
		const newUser = await User.create({
			email: normalizedEmail,
			password: hashedPassword,
			cart: {
				items: [],
			},
		});

		req.session.isLoggedIn = true;
		req.session.user = newUser;

		req.session.save(() => {
			res.redirect('/');
			signupHandler(normalizedEmail as string);
		});
	} catch (error: any) {
		console.log(error);

		res.status(422).render('auth/signup', {
			title: 'Signup',
			path: '/signup',
			errorMessage: error.message,
			inputs: {
				email: normalizedEmail,
				password: trimmedPassword,
				confirmPassword: trimmedConfirmPassword,
			},
		});
	}
};

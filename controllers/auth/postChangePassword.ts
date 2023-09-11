import { RequestHandler } from 'express';
import User from '../../models/user';
import bcrypt from 'bcrypt';

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

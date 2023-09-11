import { RequestHandler } from 'express';
import User from '../../models/user';
import crypto from 'crypto';
import { passwordResetHandler } from '../../utils/mailjet';

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

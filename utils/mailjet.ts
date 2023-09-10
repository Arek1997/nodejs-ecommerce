import mailjet from '../lib/mailjet';

export const signupHandler = async (email: string) => {
	try {
		const request = await mailjet.post('send', { version: 'v3.1' }).request({
			Messages: [
				{
					From: {
						Email: process.env.MAILJET_DEFAULT_EMAIL,
					},
					To: [
						{
							Email: email,
						},
					],
					Subject: 'Success sign up!',
					TextPart: 'Test Text',
					HTMLPart: `<h3>Your account has been created!</h3>
        <br />
        <p>Welcome onboard!</p>`,
				},
			],
		});

		console.log('request', request);
	} catch (err) {
		console.log(err);
	}
};

export const passwordResetHandler = async (
	email: string,
	token: string,
	forget: boolean
) => {
	try {
		const request = await mailjet.post('send', { version: 'v3.1' }).request({
			Messages: [
				{
					From: {
						Email: process.env.MAILJET_DEFAULT_EMAIL,
					},
					To: [
						{
							Email: email,
						},
					],
					Subject: 'Password Reset',
					TextPart: 'Test Text',
					HTMLPart: `<h3>Reset your password</h3>
        <br />
        <p>You requested password reset</p>
        <p>Click this <a href="http://localhost:3000/change-password/${token}/?forget=${forget}">link to reset your password.</a> Link is valid for one hour only.</p>
        <p>If it's not you, just ignore this message.</p>
				`,
				},
			],
		});

		console.log('request', request);
	} catch (err) {
		console.log(err);
	}
};

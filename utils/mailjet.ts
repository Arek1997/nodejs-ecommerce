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

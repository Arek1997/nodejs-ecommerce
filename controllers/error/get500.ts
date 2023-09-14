import { RequestHandler } from 'express';

export const get500: RequestHandler = (_, res) => {
	res.status(500).render('error/500', {
		title: 'Internal server error',
		path: '',
	});
};

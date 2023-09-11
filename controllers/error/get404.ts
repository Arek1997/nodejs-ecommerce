import { RequestHandler } from 'express';

export const get404: RequestHandler = (_, res) => {
	res.status(404).render('404', {
		title: 'Page not found',
		path: '',
	});
};

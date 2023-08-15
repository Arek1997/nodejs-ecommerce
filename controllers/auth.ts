import { RequestHandler } from 'express';
import User from '../models/user';

export const getLogin: RequestHandler = (req, res) => {
	res.render('auth/login', {
		title: 'Login',
		path: '/login',
	});
};

export const postLogin: RequestHandler = async (req, res) => {
	try {
		req.session.isLoggedIn = true;
		req.session.user = await User.findById('64c945f0f6a79e87c045292e');

		req.session.save(() => res.redirect('/'));
	} catch (err) {
		console.log(err);
	}
};

export const postLogout: RequestHandler = (req, res) => {
	req.session.destroy(() => res.redirect('/login'));
};

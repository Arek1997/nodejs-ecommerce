import express from 'express';
import {
	getChangePassword,
	getLogin,
	getPasswordReset,
	getSignup,
	postChangePassword,
	postLogin,
	postLogout,
	postPasswordReset,
	postSignup,
} from '../controllers/auth';

const router = express.Router();

router.post('/logout', postLogout);

router.get('/login', getLogin);

router.post('/login', postLogin);

router.get('/signup', getSignup);

router.post('/signup', postSignup);

router.get('/password-reset', getPasswordReset);

router.post('/password-reset', postPasswordReset);

router.get('/change-password/:token', getChangePassword);

router.post('/change-password/:token', postChangePassword);

export default router;

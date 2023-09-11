import express from 'express';

import { postChangePassword } from '../controllers/auth/postChangePassword';
import { getChangePassword } from '../controllers/auth/getChangePassword';
import { postPasswordReset } from '../controllers/auth/postPasswordReset';
import { getPasswordReset } from '../controllers/auth/getPasswordReset';
import { postLogout } from '../controllers/auth/postLogout';
import { postSignup } from '../controllers/auth/postSignup';
import { getSignup } from '../controllers/auth/getSignup';
import { postLogin } from '../controllers/auth/postLogin';
import { getLogin } from '../controllers/auth/getLogin';

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

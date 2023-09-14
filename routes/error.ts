import express from 'express';

import { get500 } from '../controllers/error/get500';
import { get404 } from '../controllers/error/get404';

const router = express.Router();

router.get('/500', get500);

router.get('/*', get404);

export default router;

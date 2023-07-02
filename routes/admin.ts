import express from 'express';
import {
	getAddProduct,
	getProduct,
	postAddProduct,
} from '../controllers/admin';

const router = express.Router();

router.get('/add-product', getAddProduct);

router.get('/products', getProduct);

router.post('/add-product', postAddProduct);

export default router;

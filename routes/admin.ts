import express from 'express';
import {
	getAddProduct,
	getEditProduct,
	getProduct,
	postAddProduct,
} from '../controllers/admin';

const router = express.Router();

router.get('/add-product', getAddProduct);

router.get('/products', getProduct);

router.get('/edit-product', getEditProduct);

router.post('/add-product', postAddProduct);

export default router;

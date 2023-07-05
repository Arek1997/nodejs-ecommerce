import express from 'express';
import {
	getAddProduct,
	getEditProduct,
	getProduct,
	postAddProduct,
	postEditProduct,
} from '../controllers/admin';

const router = express.Router();

router.get('/add-product', getAddProduct);

router.get('/products', getProduct);

router.get('/edit-product/:id', getEditProduct);

router.post('/edit-product/:id', postEditProduct);

router.post('/add-product', postAddProduct);

export default router;

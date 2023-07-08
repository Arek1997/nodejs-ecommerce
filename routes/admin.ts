import express from 'express';
import {
	getAddProduct,
	getEditProduct,
	getProduct,
	postAddProduct,
	postDeleteProduct,
	postEditProduct,
} from '../controllers/admin';

const router = express.Router();

router.get('/add-product', getAddProduct);

router.get('/products', getProduct);

router.get('/edit-product/:id', getEditProduct);

router.post('/edit-product/:id', postEditProduct);

router.post('/add-product', postAddProduct);

router.post('/delete-product/:id', postDeleteProduct);

export default router;

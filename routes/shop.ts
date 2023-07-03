import express from 'express';
import {
	getCart,
	getCheckout,
	getMainPage,
	getOrders,
	getProduct,
} from '../controllers/shop';

const router = express.Router();

router.get('/', getMainPage);

router.get('/products', getProduct);

router.get('/cart', getCart);

router.get('/orders', getOrders);

router.get('/checkout', getCheckout);

export default router;

import express from 'express';
import {
	getCart,
	getCheckout,
	getMainPage,
	getOrders,
	getProduct,
	getProductDetails,
} from '../controllers/shop';

const router = express.Router();

router.get('/', getMainPage);

router.get('/products', getProduct);

router.get('/product/:id', getProductDetails);

router.get('/cart', getCart);

router.get('/orders', getOrders);

router.get('/checkout', getCheckout);

export default router;

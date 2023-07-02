import express from 'express';
import {
	getCart,
	getCheckout,
	getMainPage,
	getProduct,
} from '../controllers/shop';

const router = express.Router();

router.get('/', getMainPage);

router.get('/products', getProduct);

router.get('/cart', getCart);

router.get('/checkout', getCheckout);

export default router;

import express from 'express';
import {
	getCart,
	getCheckout,
	getMainPage,
	getOrders,
	getProducts,
	getProductDetails,
	postCart,
	postRemoveFromCart,
	postOrder,
} from '../controllers/shop';

const router = express.Router();

router.get('/', getMainPage);

router.get('/products', getProducts);

router.get('/product/:id', getProductDetails);

router.get('/cart', getCart);

router.post('/add-to-cart', postCart);

router.post('/remove-from-cart/:id', postRemoveFromCart);

router.get('/orders', getOrders);

router.post('/create-order', postOrder);

router.get('/checkout', getCheckout);

export default router;

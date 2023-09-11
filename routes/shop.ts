import express from 'express';

import isAuth from '../middleware/is-auth';
import { getCart } from '../controllers/shop/getCart';
import { postCart } from '../controllers/shop/postCart';
import { postOrder } from '../controllers/shop/postOrder';
import { getOrders } from '../controllers/shop/getOrders';
import { getMainPage } from '../controllers/shop/getMainPage';
import { getProducts } from '../controllers/shop/getProducts';
import { getCheckout } from '../controllers/shop/getCheckout';
import { getProductDetails } from '../controllers/shop/getProductDetails';
import { postRemoveFromCart } from '../controllers/shop/postRemoveFromCart';

const router = express.Router();

router.get('/', getMainPage);

router.get('/products', getProducts);

router.get('/product/:id', getProductDetails);

router.use(isAuth);

router.get('/cart', getCart);

router.post('/add-to-cart', postCart);

router.post('/remove-from-cart/:id', postRemoveFromCart);

router.get('/orders', getOrders);

router.post('/create-order', postOrder);

router.get('/checkout', getCheckout);

export default router;

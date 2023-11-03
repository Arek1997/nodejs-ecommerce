import express from 'express';

import isAuth from '../middleware/is-auth';
import { getMainPage } from '../controllers/shop/getMainPage';
import { getProducts } from '../controllers/shop/getProducts';
import { getProductDetails } from '../controllers/shop/getProductDetails';
import { getCart } from '../controllers/shop/getCart';
import { postCart } from '../controllers/shop/postCart';
import { postRemoveFromCart } from '../controllers/shop/postRemoveFromCart';
import { getOrders } from '../controllers/shop/getOrders';
import { postOrder } from '../controllers/shop/postOrder';
import { getCheckout } from '../controllers/shop/getCheckout';
import { getInvoice } from '../controllers/shop/getInvoice';

const router = express.Router();

router.get('/', getMainPage);

router.get('/products', getProducts);

router.get('/product/:id', getProductDetails);

router.use(isAuth);

router.get('/cart', getCart);

router.post('/add-to-cart', postCart);

router.post('/remove-from-cart/:id', postRemoveFromCart);

router.get('/orders', getOrders);

router.get('/orders/:id', getInvoice);

router.post('/create-order', postOrder);

router.get('/checkout', getCheckout);

export default router;

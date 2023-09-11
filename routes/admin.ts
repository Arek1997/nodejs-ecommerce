import express from 'express';

import isAuth from '../middleware/is-auth';

import { getProducts } from '../controllers/admin/getProducts';
import { getAddProduct } from '../controllers/admin/getAddProduct';
import { postAddProduct } from '../controllers/admin/postAddProduct';
import { getEditProduct } from '../controllers/admin/getEditProduct';
import { postEditProduct } from '../controllers/admin/postEditProduct';
import { postDeleteProduct } from '../controllers/admin/postDeleteProduct';

const router = express.Router();

router.use(isAuth);

router.get('/add-product', getAddProduct);

router.get('/products', getProducts);

router.get('/edit-product/:id', getEditProduct);

router.post('/edit-product/:id', postEditProduct);

router.post('/add-product', postAddProduct);

router.post('/delete-product/:id', postDeleteProduct);

export default router;

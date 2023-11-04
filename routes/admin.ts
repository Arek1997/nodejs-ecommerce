import express from 'express';

import isAuth from '../middleware/is-auth';

import { getProducts } from '../controllers/admin/getProducts';
import { getAddProduct } from '../controllers/admin/getAddProduct';
import { postAddProduct } from '../controllers/admin/postAddProduct';
import { getEditProduct } from '../controllers/admin/getEditProduct';
import { postEditProduct } from '../controllers/admin/postEditProduct';
import { deleteProduct } from '../controllers/admin/deleteProduct';

const router = express.Router();

router.use(isAuth);

router.get('/add-product', getAddProduct);

router.get('/products', getProducts);

router.get('/edit-product/:id', getEditProduct);

router.post('/edit-product/:id', postEditProduct);

router.post('/add-product', postAddProduct);

router.delete('/product/:id', deleteProduct);

export default router;

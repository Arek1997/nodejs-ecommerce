import { RequestHandler } from 'express';
import Product from '../../models/product';
import { ITEMS_PER_PAGE } from '../../utils/consts';
import { calculatePaginationPages } from '../../utils/functions';

export const getProducts: RequestHandler = async (req, res) => {
	const page = req.query?.page || 1;

	const productsList = await Product.find()
		.skip((+page - 1) * ITEMS_PER_PAGE)
		.limit(ITEMS_PER_PAGE);

	const productsAmount = await Product.countDocuments();

	res.render('shop/products-list', {
		productsList,
		title: 'All Products',
		path: '/products',
		currentPage: +page,
		paginationPages: calculatePaginationPages(productsAmount, ITEMS_PER_PAGE),
	});
};

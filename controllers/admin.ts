import { RequestHandler } from 'express';
import Product, { ProductItem } from '../models/product';

export const getProducts: RequestHandler = async (req, res) => {
	const products = await Product.fetchAll();

	res.render('admin/products-list', {
		productsList: products ? products : [],
		title: 'Admin Products',
		path: '/admin/products',
	});
};

export const getAddProduct: RequestHandler = (_, res) => {
	res.render('admin/add-product', {
		title: 'Admin Add Product',
		path: '/admin/add-product',
		editMode: false,
	});
};

export const postAddProduct: RequestHandler = async (req, res) => {
	const { title, imageUrl, description, price } = req.body as Omit<
		ProductItem,
		'id'
	>;

	const product = new Product(title, price, description, imageUrl);
	await product.save();

	res.redirect('/products');
};

export const getEditProduct: RequestHandler = async (req, res) => {
	// const productId = req.params.id;
	// const searchProducts = await req.user.getProducts({
	// 	where: { id: productId },
	// });
	// const [product] = searchProducts;
	// res.render('admin/edit-product', {
	// 	productToEdit: product?.dataValues,
	// 	title: `Edit | ${product?.dataValues?.title}`,
	// 	path: '/admin/edit-product',
	// 	editMode: true,
	// });
};

export const postEditProduct: RequestHandler = async (req, res) => {
	// const productId = req.params.id;
	// const updatedProductData: Omit<ProductItem, 'id'> = req.body;
	// const productToEdit = await Product.findByPk(productId);
	// productToEdit?.update({
	// 	...productToEdit?.dataValues,
	// 	...updatedProductData,
	// });
	// await productToEdit?.save();
	// res.redirect('/admin/products');
};

export const postDeleteProduct: RequestHandler = async (req, res) => {
	// const productId = req.params.id;
	// const produtToDelete = await Product.findByPk(productId);
	// await produtToDelete?.destroy();
	// res.redirect('/admin/products');
};

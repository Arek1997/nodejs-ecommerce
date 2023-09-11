import { RequestHandler } from 'express';

export const getCart: RequestHandler = async (req, res) => {
	try {
		const cart = await req.session.user
			.populate('cart.items.productId')
			.then((products: any) => products.cart.items);

		const totalPrice = cart
			.reduce(
				(first: number, next: any) =>
					first + next.quantity * +next.productId.price,
				0
			)
			.toFixed(2);

		const totalAmount = cart.reduce(
			(first: number, next: any) => first + next.quantity,
			0
		);

		const getTitle = () => {
			switch (totalAmount) {
				case 0:
					return 'is empty';

				case 1:
					return 'product';

				default:
					return 'products';
			}
		};

		res.render('shop/cart', {
			cart,
			totalPrice,
			totalAmount,
			title: `Your cart ${totalAmount || ''} ${getTitle()}`,
			path: '/cart',
		});
	} catch (err) {
		console.log(err);
	}
};

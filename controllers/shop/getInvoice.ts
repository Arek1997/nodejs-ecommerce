import { RequestHandler } from 'express';
import fs from 'fs';
import path from 'path';
import Order from '../../models/order';
import PDFDocument from 'pdfkit';

export const getInvoice: RequestHandler = async (req, res, next) => {
	const { id: orderId } = req.params;

	try {
		const order = await Order.findById(orderId);

		if (!order) {
			throw new Error(`Order with ID: ${orderId} not found.`);
		}

		if (order.user._id.toString() !== req.session.user._id.toString()) {
			throw new Error('Unauthorized.');
		}

		const invoiceName = `pdf-${orderId}.pdf`;
		const invoicePath = path.join('data', 'invoices', invoiceName);

		const pdfDoc = new PDFDocument();
		pdfDoc.pipe(fs.createWriteStream(invoicePath));
		pdfDoc.pipe(res);

		pdfDoc.fontSize(24).font('Helvetica-Bold').text('Invoice', {
			align: 'center',
		});
		pdfDoc.text('------------------------------', { align: 'center' });
		let totalPrice = 0;
		pdfDoc.text(' ');
		order.products.forEach((prod) => {
			totalPrice += Number(prod.price) * prod.quantity;
			pdfDoc
				.fontSize(18)
				.text(`${prod.title} - ${prod.quantity} x $${prod.price}`);
		});

		pdfDoc.text(' ');
		pdfDoc.fontSize(12).text('Total price: $' + totalPrice.toFixed(2), {
			underline: true,
		});

		pdfDoc.end();
	} catch (error) {
		next(error);
	}
};

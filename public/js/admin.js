const removeButtons = document.querySelectorAll('.btn-remove-product');

const updateProductsAmount = () => {
	const productAmount = document.querySelectorAll('.product-item');

	document.querySelector('[data-amount]').textContent = productAmount.length;
};

const deleteProduct = async (e) => {
	const product = e.target.closest('article');
	const productId = product.getAttribute('data-product-id');
	const productTitle = product.querySelector('.product__title').textContent;
	const csrfToken = product.querySelector('input[name=_csrf]').value;

	const response = confirm(`Are you sure you want to remove ${productTitle}?`);

	if (!response) return;

	try {
		const res = await fetch(`/admin/product/${productId}`, {
			method: 'DELETE',
			headers: {
				'csrf-token': csrfToken,
			},
		});
		const data = await res.json();

		alert(data.message);

		if (res.ok) {
			product.remove();
			updateProductsAmount();
		}
	} catch (error) {
		console.error(error);
	}
};

removeButtons.forEach((btn) => btn.addEventListener('click', deleteProduct));

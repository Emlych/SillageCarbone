// productService.js
import axios from "axios";

export const fetchProductById = async (_id: string) => {
	const url = `http://localhost:8001/product/${_id}`;
	try {
		const response = await axios.get(url);
		const productData = response.data;
		if (!productData) {
			throw new Error("No product was found");
		}
		return response.data.product;
	} catch (error) {
		console.error(error);
		throw new Error("Product not found");
	}
};

export const fetchSimilarProducts = async (productType: string, excludeId: string) => {
	const url = `http://localhost:8001/products/`;
	try {
		const response = await axios.get(url, {
			params: { type: productType, excludeId, limit: 3, page: 1 },
		});
		if (!response.data?.products) {
			throw new Error("No products retrieved");
		}
		return response.data.products;
	} catch (error: any) {
		console.error(error);
		throw new Error(error.message);
	}
};

import axios from "axios";
import Cookies from "js-cookie";
import { ProductWithCO2 } from "../dto/ProductDto";

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

export const fetchProductsForCache = async () => {
	const url = "http://localhost:8000/products/cache";

	try {
		const response = await axios.get(url);

		if (!response.data?.products) {
			throw new Error("No products retrieved");
		}
		return response.data.products;
	} catch (error) {
		console.error("Error ", error);
	}
};

export const fetchProducts = async (
	name: string,
	company: string,
	limitPerPage: number,
	page: number,
	archivedProducts?: boolean
): Promise<{ products: ProductWithCO2[]; count: number }> => {
	const url = archivedProducts
		? "http://localhost:8000/products/archived"
		: "http://localhost:8000/products";

	try {
		// -- Is user connected as admin
		const adminToken = Cookies.get("adminToken");
		if (!adminToken) {
			throw new Error("Not authorized to access list of users.");
		}

		const response = await axios.get(url, {
			headers: { authorization: `Bearer ${adminToken}` },
			params: {
				name,
				company,
				limit: limitPerPage,
				page,
				archived: archivedProducts,
			},
		});

		if (!response.data?.products) {
			throw new Error("No products retrieved");
		}

		const products = response.data.products;
		const count = response.data.count;

		return { products, count };
	} catch (error) {
		throw new Error("Error fetching products.");
	}
};

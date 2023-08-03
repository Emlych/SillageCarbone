import axios from "axios";
import Cookies from "js-cookie";
import { ProductWithCO2 } from "../dto/ProductDto";
import { Transportation } from "../dto/TransportationDto";

/**
 * Fetch product data by its _id
 * @param _id
 * @returns a promise
 */
export const fetchProductById = async (_id: string) => {
	// -- API endpoint url based on the provided product ID
	const url = `http://localhost:8000/product/${_id}`;
	try {
		const response = await axios.get(url);
		const productData = response.data;

		// -- Product data null or undefined
		if (!productData) {
			throw new Error("No product was found");
		}
		return response.data.product;
	} catch (error: any) {
		throw new Error(error.message);
	}
};

/**
 * Fetch similar products based on product type and excludeId
 * @param productType
 * @param excludeId : don't retrieve the product already displayed
 * @returns
 */
export const fetchSimilarProducts = async (productType: string, excludeId: string) => {
	// -- API endpoint url to all products
	const url = `http://localhost:8000/products/caroussel`;
	try {
		const response = await axios.get(url, {
			params: { type: productType, excludeId, limit: 3, page: 1 },
		});
		if (!response.data?.products) {
			throw new Error("No products retrieved");
		}
		return response.data.products;
	} catch (error: any) {
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

export const createProduct = async (
	name: string,
	company: string,
	type: string,
	originHarbour: string,
	destinationHarbour: string,
	transportation: string,
	description?: string
): Promise<{ _id: string; mail: string; token: string }> => {
	const url = "http://localhost:8000/product/create";

	try {
		if (
			!name ||
			!company ||
			!type ||
			!originHarbour ||
			!destinationHarbour ||
			!transportation
		) {
			throw new Error("Missing field");
		}

		// -- Is user connected as admin
		const adminToken = Cookies.get("adminToken");
		if (!adminToken) {
			throw new Error("Not authorized to access list of users.");
		}

		// send product to server
		const response = await axios.post(
			url,
			{
				name,
				company,
				type,
				originHarbour,
				destinationHarbour,
				transportation,
				description,
			},
			{ headers: { authorization: `Bearer ${adminToken}` } }
		);

		if (!response.data) {
			throw new Error("User could not be created");
		}
		return response.data;
	} catch (error) {
		throw new Error("User could not be created");
	}
};

export const deleteProduct = async (_id: string) => {
	const url = "http://localhost:8000/product/delete";

	try {
		// -- No id registered (needs to be investigated)
		if (!_id) {
			throw new Error("Missing product id");
		}

		// -- Is user connected as admin
		const adminToken = Cookies.get("adminToken");
		if (!adminToken) {
			throw new Error("Missing authorization");
		}

		// -- Send delete request
		const response = await axios.delete(url, {
			headers: { authorization: `Bearer ${adminToken}` },
			data: { _id },
		});

		if (!response.data) {
			throw new Error("Could not delete product");
		}
		return response.data;
	} catch (error: any) {
		throw new Error(error.message);
	}
};

export const archiveProduct = async (_id: string, archiveStatus: boolean) => {
	const url = "http://localhost:8000/product/archive";

	try {
		// -- No id registered (needs to be investigated)
		if (!_id) {
			throw new Error("Missing product id");
		}

		// -- Is user connected as admin
		const adminToken = Cookies.get("adminToken");
		if (!adminToken) {
			throw new Error("Missing authorization");
		}

		// -- Send update request
		const response = await axios.put(
			url,
			{
				_id,
				archive: archiveStatus,
			},
			{ headers: { authorization: `Bearer ${adminToken}` } }
		);

		if (!response.data) {
			throw new Error("Could not delete product");
		}
		return response.data;
	} catch (error: any) {
		throw new Error(error.message);
	}
};

export const createNewTransportation = async (
	newTransportation: string,
	carbonCoef: number
): Promise<{ _id: string; mail: string; token: string }> => {
	const url = "http://localhost:8000/product/transportation/create";

	try {
		if (!newTransportation || !carbonCoef) {
			throw new Error("Missing field");
		}

		// send transportation to server
		const response = await axios.post(url, {
			transportation: newTransportation,
			carbonCoefficient: carbonCoef,
		});

		if (!response.data) {
			throw new Error("User could not be created");
		}
		return response.data;
	} catch (error) {
		throw new Error("User could not be created");
	}
};

export const fetchTransportations = async (): Promise<Transportation[]> => {
	const url = "http://localhost:8000/transportations";

	try {
		const response = await axios.get(url);

		if (!response.data?.transportations) {
			throw new Error("No transportations retrieved");
		}

		return response.data.transportations;
	} catch (error) {
		throw new Error("Error fetching products.");
	}
};

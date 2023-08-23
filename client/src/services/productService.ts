import axios from "axios";
import Cookies from "js-cookie";
import { ProductWithCO2 } from "../dto/ProductDto";
import { Transportation } from "../dto/TransportationDto";

/** Backend url */
const urlBase = "https://sillage-carbone-5c169e907e77.herokuapp.com";

/**
 * Fetch product data by its _id
 * @param _id
 * @returns a promise
 */
export const fetchProductById = async (_id: string): Promise<any> => {
	// -- API endpoint url based on the provided product ID
	const url = `${urlBase}/product/${_id}`;
	try {
		const response = await axios.get(url);

		// -- Product data null or undefined
		if (!response.data?.product) {
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
	const url = `${urlBase}/products/caroussel`;
	try {
		const response = await axios.get(url, {
			params: { type: productType, excludeId },
		});
		if (!response.data?.products) {
			throw new Error("No products retrieved");
		}
		return response.data.products;
	} catch (error: any) {
		throw new Error(error.message);
	}
};

/**
 * Fetch all products and return name, company and id
 * @returns Products data : name, company and id
 */
export const fetchProductsForCache = async () => {
	const url = `${urlBase}/products/cache`;
	try {
		const response = await axios.get(url);
		if (!response.data?.products) {
			throw new Error("No products retrieved");
		}
		return response.data.products;
	} catch (error: any) {
		throw new Error(error.message);
	}
};

/**
 * Fetch products with filter (see params)
 * @param name
 * @param company
 * @param limitPerPage
 * @param page
 * @param archivedProducts
 * @returns
 */
export const fetchProducts = async (
	name: string,
	company: string,
	limitPerPage: number,
	page: number,
	archivedProducts?: boolean
): Promise<{ products: ProductWithCO2[]; count: number }> => {
	const url = archivedProducts ? `${urlBase}/products/archived` : `${urlBase}/products`;

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
	} catch (error: any) {
		throw new Error(error.message);
	}
};

/**
 * Create product
 * @param name
 * @param company
 * @param type
 * @param originCity
 * @param originCountry
 * @param destinationCity
 * @param destinationCountry
 * @param transportation
 * @param description
 * @param picture
 * @returns success status (boolean) and data object
 */
export const createProduct = async (
	name: string,
	company: string,
	type: string,
	originCity: string,
	originCountry: string,
	destinationCity: string,
	destinationCountry: string,
	transportation: string,
	description?: string,
	picture?: File
): Promise<{ success: boolean; data: { name: string; company: string } }> => {
	const url = `${urlBase}/product/create`;

	try {
		if (
			!name ||
			!company ||
			!type ||
			!originCity ||
			!originCountry ||
			!destinationCity ||
			!destinationCountry ||
			!transportation
		) {
			throw new Error("Missing field");
		}

		// -- Is user connected as admin
		const adminToken = Cookies.get("adminToken");
		if (!adminToken) {
			throw new Error("Not authorized to access list of users.");
		}

		const formData = new FormData();
		formData.append("name", name);
		formData.append("company", company);
		formData.append("type", type);
		formData.append("originCity", originCity);
		formData.append("originCountry", originCountry);
		formData.append("destinationCity", destinationCity);
		formData.append("destinationCountry", destinationCountry);
		formData.append("transportation", transportation);
		if (description) formData.append("description", description);
		if (picture) formData.append("picture", picture);

		// send product to server
		const response = await axios.post(url, formData, {
			headers: {
				authorization: `Bearer ${adminToken}`,
				"Content-Type": "multipart/form-data",
			},
		});

		if (!response.data) {
			throw new Error("Product could not be created");
		}
		// Return the response data in an object with a success flag
		return { success: true, data: response.data };
	} catch (error: any) {
		throw new Error(error.message);
	}
};

/**
 * Delete a product by passing its id
 * @param _id
 * @returns
 */
export const deleteProduct = async (_id: string) => {
	const url = `${urlBase}/product/delete`;

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

/**
 * Archive a product
 * @param _id
 * @param archiveStatus
 * @returns
 */
export const archiveProduct = async (_id: string, archiveStatus: boolean) => {
	const url = `${urlBase}/product/archive`;

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

/**
 * Create a new transportation
 * @param newTransportation
 * @param carbonCoef
 * @returns
 */
export const createNewTransportation = async (
	newTransportation: string,
	carbonCoef: number
): Promise<{ _id: string; mail: string; token: string }> => {
	const url = `${urlBase}/product/transportation/create`;

	try {
		// -- Is user connected as admin
		const adminToken = Cookies.get("adminToken");
		if (!adminToken) {
			throw new Error("Not authorized to access list of transportations.");
		}

		if (!newTransportation || !carbonCoef) {
			throw new Error("Missing field");
		}

		// send transportation to server
		const response = await axios.post(
			url,
			{
				transportation: newTransportation,
				carbonCoefficient: carbonCoef,
			},
			{
				headers: { authorization: `Bearer ${adminToken}` },
			}
		);

		if (!response.data) {
			throw new Error("Transportation could not be created");
		}
		return response.data;
	} catch (error: any) {
		throw new Error(error.message);
	}
};

/**
 * Fetch transportations
 * @returns
 */
export const fetchTransportations = async (): Promise<Transportation[]> => {
	const url = `${urlBase}/transportations`;

	try {
		// -- Is user connected as admin
		const adminToken = Cookies.get("adminToken");
		if (!adminToken) {
			throw new Error("Not authorized to access list of transportations.");
		}

		const response = await axios.get(url, {
			headers: { authorization: `Bearer ${adminToken}` },
		});

		if (!response.data?.transportations) {
			throw new Error("No transportations retrieved");
		}

		return response.data.transportations;
	} catch (error: any) {
		throw new Error(error.message);
	}
};

/**
 * Delete transportation
 * @param _id
 * @returns
 */
export const deleteTransportation = async (_id: string) => {
	const url = `${urlBase}/transportation/delete`;

	try {
		// -- No id registered (needs to be investigated)
		if (!_id) {
			throw new Error("Missing transportation id");
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
			throw new Error("Error in deletion of transportation.");
		}

		return { success: response.data.canDelete, data: response.data }; //TODO change stupid first key
	} catch (error: any) {
		throw new Error(error.message);
	}
};

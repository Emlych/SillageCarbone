import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import Cookies from "js-cookie";
import {
	archiveProduct,
	createNewTransportation,
	createProduct,
	deleteProduct,
	deleteTransportation,
	fetchProductById,
	fetchProducts,
	fetchProductsForCache,
	fetchSimilarProducts,
	fetchTransportations,
} from "./productService";

const mock = new MockAdapter(axios);
const mockAdminToken = "admin-token"; // Mock the admin token value

const urlBase = "https://sillage-carbone-5c169e907e77.herokuapp.com";

beforeEach(() => {
	// -- Mock method Cookies.get to return the admin token
	Cookies.get = jest.fn().mockReturnValue(mockAdminToken);
});

afterEach(() => {
	mock.reset(); // Reset the mock after each test
});

describe("fetchProductById", () => {
	it("Fetch product by ID successfully", async () => {
		const productId = "product-id";
		const mockProduct = { _id: productId, name: "Product 1" };
		const url = `${urlBase}/product/${productId}`;
		mock.onGet(url).reply(200, { product: mockProduct });

		const result = await fetchProductById(productId);
		expect(result).toEqual(mockProduct);
	});
	it("Throw an error when product data is null", async () => {
		const productId = "non-existing-id";
		const url = `${urlBase}/product/${productId}`;
		mock.onGet(url).reply(200, { product: null });
		await expect(fetchProductById(productId)).rejects.toThrow("No product was found");
	});
	it("Throw a status code error 404 when no product found", async () => {
		const productId = "non-existing-id";
		const url = `${urlBase}/product/${productId}`;
		mock.onGet(url).reply(404);

		await expect(fetchProductById(productId)).rejects.toThrow(
			"Request failed with status code 404"
		);
	});
	it("Network error", async () => {
		const productId = "product-id";
		const url = `${urlBase}/product/${productId}`;
		mock.onGet(url).networkError();

		await expect(fetchProductById(productId)).rejects.toThrow("Network Error");
	});
});

describe("fetchSimilarProducts", () => {
	it("Fetch similar products successfully", async () => {
		const productType = "produit de la mer";
		const excludeId = "p1";
		// Mock response for the API call
		const mockResponse = {
			products: [
				{ id: "1", name: "Product 1" },
				{ id: "2", name: "Product 2" },
				{ id: "3", name: "Product 3" },
			],
		};
		const url = `${urlBase}/products/caroussel`;
		mock.onGet(url).reply(200, mockResponse);
		const result = await fetchSimilarProducts(productType, excludeId);
		expect(result).toEqual(mockResponse.products);
	});
	it("Throw an status code error 404 when no similar products retrieved", async () => {
		const productType = "some-product-type";
		const excludeId = "excluded-product-id";
		const url = `${urlBase}/products/caroussel`;

		// Mock the response with no products data
		mock.onGet(url).reply(200, {});
		// Expect the fetchSimilarProducts function to throw an error with the specified message
		await expect(fetchSimilarProducts(productType, excludeId)).rejects.toThrow(
			"No products retrieved"
		);
	});
	it("Throw an error on network error", async () => {
		const productType = "some-product-type";
		const excludeId = "excluded-product-id";
		const url = `${urlBase}/products/caroussel`;

		// Mock a network error for the API call
		mock.onGet(url).networkError();
		// Expect the fetchSimilarProducts function to throw an error with the specified message
		await expect(fetchSimilarProducts(productType, excludeId)).rejects.toThrow(
			"Network Error"
		);
	});
});

describe("fetchProductsForCache", () => {
	it("Fetch products successfully and return the products", async () => {
		const mockProducts = [
			{ _id: "1", name: "Product 1", company: "Company 1" },
			{ _id: "2", name: "Product 2", company: "Company 2" },
		];
		const url = `${urlBase}/products/cache`;
		// Mock the response with products data
		mock.onGet(url).reply(200, { products: mockProducts });
		const products = await fetchProductsForCache();
		expect(products).toEqual(mockProducts);
	});
	it("Throw an error when no products retrieved", async () => {
		const url = `${urlBase}/products/cache`;
		mock.onGet(url).reply(200, { products: null });
		await expect(fetchProductsForCache()).rejects.toThrow("No products retrieved");
	});
	it("Handle network errors and throw an error with the correct message", async () => {
		const url = `${urlBase}/products/cache`;
		// Mock a network error for the API call
		mock.onGet(url).networkError();
		await expect(fetchProductsForCache()).rejects.toThrow("Network Error");
	});
});

describe("fetchProducts", () => {
	it("Fetch products successfully and return the products with count", async () => {
		const mockProducts = [
			{ _id: "1", name: "Product 1", company: "Company 1" },
			{ _id: "2", name: "Product 2", company: "Company 2" },
		];
		const mockCount = 2;
		const url = `${urlBase}/products`;

		// Mock the response with products data and count
		mock.onGet(url).reply(200, { products: mockProducts, count: mockCount });
		const products = await fetchProducts("Product", "Company", 10, 1);
		expect(products).toEqual({ products: mockProducts, count: mockCount });
	});

	it("Throw an error when no products retrieved", async () => {
		const url = `${urlBase}/products`;
		// Mock the response with an empty object (no products data)
		mock.onGet(url).reply(200, {});
		await expect(fetchProducts("Product", "Company", 10, 1)).rejects.toThrow(
			"No products retrieved"
		);
	});

	it("Throw an error when not authorized", async () => {
		const url = `${urlBase}/products`;
		// Mock the response with a 401 status code
		Cookies.get = jest.fn().mockReturnValue(null);

		// Mock the response with a 401 status code
		mock.onGet(url).reply(401);
		await expect(fetchProducts("Product", "Company", 10, 1)).rejects.toThrow(
			"Not authorized to access list of users."
		);
	});
});

describe("createProduct", () => {
	it("Create a product successfully and return the product info", async () => {
		const mockProduct = {
			_id: "product-id",
			name: "Product 1",
			company: "Company 1",
			type: "Type 1",
			originCity: "Origin City",
			originCountry: "Origin Country",
			destinationCity: "Destination City",
			destinationCountry: "Destination Country",
			transportation: "Transportation 1",
			description: "Description of the product",
		};
		const url = `${urlBase}/product/create`;
		// Mock the response with the created product data
		mock.onPost(url).reply(200, mockProduct);
		const productInfo = await createProduct(
			"Product 1",
			"Company 1",
			"Type 1",
			"Origin City Harbour",
			"Origin Country Harbour",
			"Destination City Harbour",
			"Destination Cuountry Harbour",
			"Transportation 1",
			"Description of the product"
		);
		const expectedResult = {
			success: true,
			data: mockProduct,
		};
		expect(productInfo).toEqual(expectedResult);
	});
	it("Throw an error when required fields are missing", async () => {
		await expect(
			createProduct(
				"",
				"Company 1",
				"Type 1",
				"",
				"",
				"Destination City Harbour",
				"",
				"Transportation 1"
			)
		).rejects.toThrow("Missing field");
	});
	it("Throw an error when not authorized", async () => {
		// Mock the response with a 401 status code
		Cookies.get = jest.fn().mockReturnValue(null);
		const url = `${urlBase}/product/create`;
		mock.onPost(url).reply(401);
		await expect(
			createProduct(
				"Product 1",
				"Company 1",
				"Type 1",
				"Origin Harbour City",
				"Origin Harbour Country",
				"Destination Harbour City",
				"Destination Harbour Country",
				"Transportation 1"
			)
		).rejects.toThrow("Not authorized to access list of users.");
	});
	it("Throw an error when product creation fails", async () => {
		const url = `${urlBase}/product/create`;
		// Mock the response with an empty object (no product data)
		mock.onPost(url).reply(404, {});
		await expect(
			createProduct(
				"Product 1",
				"Company 1",
				"Type 1",
				"Origin City Harbour",
				"Origin Country Harbour",
				"Destination City Harbour",
				"Destination Country Harbour",
				"Transportation 1"
			)
		).rejects.toThrow("Request failed with status code 404");
	});
	it("Handle network errors and throw an error with the correct message", async () => {
		const url = `${urlBase}/product/create`;
		// Mock a network error for the API call
		mock.onPost(url).networkError();
		await expect(
			createProduct(
				"Product 1",
				"Company 1",
				"Type 1",
				"Origin City Harbour",
				"Origin Country Harbour",
				"Destination City Harbour",
				"Destination Country Harbour",
				"Transportation 1"
			)
		).rejects.toThrow("Network Error");
	});
	it("Throw an error when product not created", async () => {
		const url = `${urlBase}/product/create`;
		mock.onPost(url).reply(200, null);
		await expect(
			createProduct(
				"Product 1",
				"Company 1",
				"Type 1",
				"Origin City Harbour",
				"Origin Country Harbour",
				"Destination City Harbour",
				"Destination Country Harbour",
				"Transportation 1"
			)
		).rejects.toThrow("Product could not be created");
	});
	it("Create a product successfully with picture and return the product info", async () => {
		const mockProduct = {
			_id: "product-id",
			name: "Product 1",
			company: "Company 1",
			type: "Type 1",
			originCity: "Origin City",
			originCountry: "Origin Country",
			destinationCity: "Destination City",
			destinationCountry: "Destination Country",
			transportation: "Transportation 1",
			description: "Description of the product",
		};

		const pictureFile = new File([""], "test-picture.jpg", { type: "image/jpeg" });

		const url = `${urlBase}/product/create`;
		mock.onPost(url).reply(200, mockProduct);

		const productInfo = await createProduct(
			"Product 1",
			"Company 1",
			"Type 1",
			"Origin City Harbour",
			"Origin Country Harbour",
			"Destination City Harbour",
			"Destination Cuountry Harbour",
			"Transportation 1",
			"Description of the product",
			pictureFile
		);

		const expectedResult = {
			success: true,
			data: mockProduct,
		};

		expect(productInfo).toEqual(expectedResult);
	});
});

describe("deleteProduct", () => {
	it("Delete a product successfully", async () => {
		const productId = "valid_product_id";
		const adminToken = "valid_admin_token";
		const responseData = { message: "Product deleted successfully" };
		Cookies.set("adminToken", adminToken);
		const url = `${urlBase}/product/delete`;
		// Mock the successful delete request
		mock
			.onDelete(url, {
				headers: { authorization: `Bearer ${adminToken}` },
				data: { _id: productId },
			})
			.reply(200, responseData);
		const result = await deleteProduct(productId);
		expect(result).toEqual(responseData);
	});
	it("Throw an error when product ID is missing", async () => {
		const url = `${urlBase}/product/delete`;
		mock.onGet(url).reply(404);
		await expect(deleteProduct("")).rejects.toThrow("Missing product id");
	});
	it("Throw an error when adminToken is missing", async () => {
		const productId = "valid_product_id";
		Cookies.get = jest.fn().mockReturnValue(null);
		const url = `${urlBase}/product/delete`;
		mock.onDelete(url, {
			data: { _id: productId },
		});
		await expect(deleteProduct(productId)).rejects.toThrow("Missing authorization");
	});
	it("Throw an error when product deletion is unsuccessful", async () => {
		const productId = "valid_product_id";
		const adminToken = "valid_admin_token";
		Cookies.set("adminToken", adminToken);
		const url = `${urlBase}/product/delete`;
		// Mock the unsuccessful delete request
		mock
			.onDelete(url, {
				headers: { authorization: `Bearer ${adminToken}` },
				data: { _id: productId },
			})
			.reply(500);
		await expect(deleteProduct(productId)).rejects.toThrow(
			"Request failed with status code 500"
		);
	});
	it("Throw an error when could not delete product", async () => {
		const url = `${urlBase}/product/delete`;
		const productId = "valid_product_id";

		mock.onDelete(url).reply(200, null);
		await expect(deleteProduct(productId)).rejects.toThrow("Could not delete product");
	});
});

describe("archiveProduct", () => {
	it("Throw an error when product ID is missing", async () => {
		const archiveStatus = true;
		const url = `${urlBase}/product/archive`;
		mock.onGet(url).reply(404);
		await expect(archiveProduct("", archiveStatus)).rejects.toThrow("Missing product id");
	});
	it("Throw an error when adminToken is missing", async () => {
		Cookies.get = jest.fn().mockReturnValue(null);
		const productId = "valid_product_id";
		const archiveStatus = true;
		await expect(archiveProduct(productId, archiveStatus)).rejects.toThrow(
			"Missing authorization"
		);
	});
	it("Archive a product successfully", async () => {
		const productId = "valid_product_id";
		const archiveStatus = true;
		const adminToken = "valid_admin_token";
		Cookies.set("adminToken", adminToken);
		const responseData = { message: "Product archived successfully" };

		const url = `${urlBase}/product/archive`;
		mock.onPut(url, { _id: productId, archive: archiveStatus }).reply(200, responseData);
		const result = await archiveProduct(productId, archiveStatus);
		expect(result).toEqual(responseData);
	});
	it("Throw an error when product archiving fails", async () => {
		const productId = "valid_product_id";
		const archiveStatus = true;
		const adminToken = "valid_admin_token";
		Cookies.set("adminToken", adminToken);
		mock.onPut(`${urlBase}/product/archive`).reply(200, null);
		await expect(archiveProduct(productId, archiveStatus)).rejects.toThrow(
			"Could not delete product"
		);
	});
	it("Handle network errors and throw an error with the correct message", async () => {
		const productId = "valid_product_id";
		const archiveStatus = true;
		const adminToken = "valid_admin_token";
		Cookies.set("adminToken", adminToken);
		mock.onPut(`${urlBase}/product/archive`).networkError();
		await expect(archiveProduct(productId, archiveStatus)).rejects.toThrow(
			"Network Error"
		);
	});
	it("Fetch products from archived endpoint when archivedProducts is truthy", async () => {
		const mockProducts = [
			{ _id: "3", name: "Archived Product 1", company: "Company 1" },
			{ _id: "4", name: "Archived Product 2", company: "Company 2" },
		];
		const mockCount = 2;
		const url = `${urlBase}/products/archived`;

		mock.onGet(url).reply(200, { products: mockProducts, count: mockCount });
		const products = await fetchProducts("Product", "Company", 10, 1, true);
		expect(products).toEqual({ products: mockProducts, count: mockCount });
	});
});

describe("createNewTransportation", () => {
	it("Create a new transportation successfully", async () => {
		const newTransportation = "Car";
		const carbonCoef = 1.5;
		const mockTransportation = {
			transportation: newTransportation,
			carbonCoefficient: carbonCoef,
		};
		const responseData = {
			_id: "valid_id",
			name: newTransportation,
			carbonCoefficient: carbonCoef,
		};
		const url = `${urlBase}/product/transportation/create`;
		// Mock the successful post request
		mock.onPost(url, mockTransportation).reply(200, responseData);
		const result = await createNewTransportation(newTransportation, carbonCoef);
		expect(result).toEqual(responseData);
	});
	it("Throw an error when newTransportation is missing", async () => {
		const carbonCoef = 1.5;
		await expect(createNewTransportation("", carbonCoef)).rejects.toThrow(
			"Missing field"
		);
	});
	it("Throw an error when carbonCoef is missing", async () => {
		const newTransportation = "Car";
		await expect(createNewTransportation(newTransportation, 0)).rejects.toThrow(
			"Missing field"
		);
	});
	it("Throw an error when transportation creation is unsuccessful", async () => {
		const newTransportation = "Car";
		const carbonCoef = 1.5;
		const url = `${urlBase}/product/transportation/create`;

		// Mock the unsuccessful post request
		mock
			.onPost(url, {
				transportation: newTransportation,
				carbonCoefficient: carbonCoef,
			})
			.reply(500);
		await expect(createNewTransportation(newTransportation, carbonCoef)).rejects.toThrow(
			"Request failed with status code 500"
		);
	});
	it("Throw an error when could not create a transportation", async () => {
		const url = `${urlBase}/product/transportation/create`;
		const newTransportation = "Car";
		const carbonCoef = 1.5;
		mock
			.onPost(url, {
				transportation: newTransportation,
				carbonCoefficient: carbonCoef,
			})
			.reply(200, null);
		await expect(createNewTransportation(newTransportation, carbonCoef)).rejects.toThrow(
			"Transportation could not be created"
		);
	});
});

describe("fetchTransportations", () => {
	it("Fetch transportations successfully", async () => {
		const responseData = {
			transportations: [
				{ _id: "id1", name: "Car", carbonCoefficient: 1.5 },
				{ _id: "id2", name: "Bike", carbonCoefficient: 0.0 },
			],
		};
		const url = `${urlBase}/transportations`;
		// Mock the successful get request
		mock.onGet(url).reply(200, responseData);
		const result = await fetchTransportations();
		expect(result).toEqual(responseData.transportations);
	});
	it("Throw an error when no transportations are retrieved", async () => {
		const url = `${urlBase}/transportations`;
		// Mock the successful get request with no transportations data
		mock.onGet(url).reply(200, {});
		await expect(fetchTransportations()).rejects.toThrow("No transportations retrieved");
	});
	it("Throw an error when fetching transportations is unsuccessful", async () => {
		const url = `${urlBase}/transportations`;
		// Mock the unsuccessful get request
		mock.onGet(url).reply(500);
		await expect(fetchTransportations()).rejects.toThrow(
			"Request failed with status code 500"
		);
	});
	it("Throw an error when not authorized", async () => {
		const url = `${urlBase}/transportations`;
		// Mock the response with a 401 status code
		Cookies.get = jest.fn().mockReturnValue(null);

		// Mock the response with a 401 status code
		mock.onGet(url).reply(401);
		await expect(fetchTransportations()).rejects.toThrow(
			"Not authorized to access list of transportations."
		);
	});
});

describe("deleteTransportation", () => {
	it("should delete a transportation successfully", async () => {
		const url = `${urlBase}/transportation/delete`;
		const transportId = "valid_transport_id";
		const adminToken = "valid_admin_token";
		const responseData = {
			success: true,
			data: { canDelete: true, message: "Transportation deleted" },
		};
		Cookies.set("adminToken", adminToken);
		// Mock the successful delete request
		mock
			.onDelete(url, {
				headers: { authorization: `Bearer ${adminToken}` },
				data: { _id: transportId },
			})
			.reply(200, responseData);
		const result = await deleteTransportation(transportId);
		expect(result.data).toEqual(responseData);
	});
	it("Throw an error when transport ID is missing", async () => {
		const url = `${urlBase}/transportation/delete`;
		mock.onGet(url).reply(404);
		await expect(deleteTransportation("")).rejects.toThrow("Missing transportation id");
	});
	it("Throw an error when adminToken is missing", async () => {
		const transportId = "valid_transport_id";
		Cookies.get = jest.fn().mockReturnValue(null);
		const url = `${urlBase}/transportation/delete`;
		mock
			.onDelete(url, {
				data: { _id: transportId },
			})
			.reply(401);
		await expect(deleteTransportation(transportId)).rejects.toThrow(
			"Missing authorization"
		);
	});
	it("Throw an error when transportation deletion is unsuccessful", async () => {
		const transportId = "valid_transport_id";
		const adminToken = "valid_admin_token";
		Cookies.set("adminToken", adminToken);
		const url = `${urlBase}/transportation/delete`;
		// Mock the unsuccessful delete request
		mock
			.onDelete(url, {
				headers: { authorization: `Bearer ${adminToken}` },
				data: { _id: transportId },
			})
			.reply(500);
		await expect(deleteTransportation(transportId)).rejects.toThrow(
			"Request failed with status code 500"
		);
	});
	it("Throw an error when no transportation deleted", async () => {
		const transportId = "valid_transport_id";
		const adminToken = "valid_admin_token";
		Cookies.set("adminToken", adminToken);
		const url = `${urlBase}/transportation/delete`;
		mock
			.onDelete(url, {
				headers: { authorization: `Bearer ${adminToken}` },
				data: { _id: transportId },
			})
			.reply(200, null);
		await expect(deleteTransportation(transportId)).rejects.toThrow(
			"Error in deletion of transportation."
		);
	});
});

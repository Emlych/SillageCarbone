import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import Cookies from "js-cookie";
import {
	archiveProduct,
	createNewTransportation,
	createProduct,
	deleteProduct,
	fetchProductById,
	fetchProducts,
	fetchProductsForCache,
	fetchSimilarProducts,
	fetchTransportations,
} from "./productService";

const mock = new MockAdapter(axios);

const mockAdminToken = "admin-token"; // Mock the admin token value

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

		mock.onGet(`http://localhost:8000/product/${productId}`).reply(200, {
			product: mockProduct,
		});

		const result = await fetchProductById(productId);
		expect(result).toEqual(mockProduct);
	});

	it("Throw a status code error 404 when no product found", async () => {
		const productId = "non-existing-id";

		mock.onGet(`http://localhost:8000/product/${productId}`).reply(404);

		await expect(fetchProductById(productId)).rejects.toThrow(
			"Request failed with status code 404"
		);
	});

	it("Network error", async () => {
		const productId = "product-id";

		mock.onGet(`http://localhost:8000/product/${productId}`).networkError();

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
		mock.onGet("http://localhost:8000/products/caroussel").reply(200, mockResponse);

		const result = await fetchSimilarProducts(productType, excludeId);
		expect(result).toEqual(mockResponse.products);
	});

	it("Throw an status code error 404 when no similar products retrieved", async () => {
		const productType = "some-product-type";
		const excludeId = "excluded-product-id";

		// Mock the response with no products data
		mock.onGet("/products/caroussel").reply(200, {});

		// Expect the fetchSimilarProducts function to throw an error with the specified message
		await expect(fetchSimilarProducts(productType, excludeId)).rejects.toThrow(
			"Request failed with status code 404"
		);
	});

	it("Throw an error on network error", async () => {
		const productType = "some-product-type";
		const excludeId = "excluded-product-id";

		// Mock a network error for the API call
		mock.onGet("/products/caroussel").networkError();

		// Expect the fetchSimilarProducts function to throw an error with the specified message
		await expect(fetchSimilarProducts(productType, excludeId)).rejects.toThrow(
			"Request failed with status code 404"
		);
	});
});

describe("fetchProductsForCache", () => {
	it("Fetch products successfully and return the products", async () => {
		const mockProducts = [
			{ _id: "1", name: "Product 1", company: "Company 1" },
			{ _id: "2", name: "Product 2", company: "Company 2" },
		];

		// Mock the response with products data
		mock
			.onGet("http://localhost:8000/products/cache")
			.reply(200, { products: mockProducts });

		const products = await fetchProductsForCache();

		expect(products).toEqual(mockProducts);
	});

	it("Throw an error when no products retrieved", async () => {
		// Mock the response with an empty object (no products data)
		mock.onGet("http://localhost:8000/products/cache").reply(404, {});

		await expect(fetchProductsForCache()).rejects.toThrow(
			"Request failed with status code 404"
		);
	});

	it("Handle network errors and throw an error with the correct message", async () => {
		// Mock a network error for the API call
		mock.onGet("http://localhost:8000/products/cache").networkError();

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

		// Mock the response with products data and count
		mock
			.onGet("http://localhost:8000/products")
			.reply(200, { products: mockProducts, count: mockCount });

		const products = await fetchProducts("Product", "Company", 10, 1);

		expect(products).toEqual({ products: mockProducts, count: mockCount });
	});

	it("Throw an error when no products retrieved", async () => {
		// Mock the response with an empty object (no products data)
		mock.onGet("http://localhost:8000/products").reply(200, {});

		await expect(fetchProducts("Product", "Company", 10, 1)).rejects.toThrow(
			"No products retrieved"
		);
	});

	it("Throw an error when not authorized", async () => {
		// Mock the response with a 401 status code
		Cookies.get = jest.fn().mockReturnValue(null);

		// Mock the response with a 401 status code
		mock.onGet("http://localhost:8000/products").reply(401);

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

		// Mock the response with the created product data
		mock.onPost("http://localhost:8000/product/create").reply(200, mockProduct);

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

		expect(productInfo).toEqual(mockProduct);
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

		mock.onPost("http://localhost:8000/product/create").reply(401);

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
		// Mock the response with an empty object (no product data)
		mock.onPost("http://localhost:8000/product/create").reply(404, {});

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
		// Mock a network error for the API call
		mock.onPost("http://localhost:8000/product/create").networkError();

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
});

describe("deleteProduct", () => {
	it("should delete a product successfully", async () => {
		const productId = "valid_product_id";
		const adminToken = "valid_admin_token";
		const responseData = { message: "Product deleted successfully" };
		Cookies.set("adminToken", adminToken);

		// Mock the successful delete request
		mock
			.onDelete("http://localhost:8000/product/delete", {
				headers: { authorization: `Bearer ${adminToken}` },
				data: { _id: productId },
			})
			.reply(200, responseData);

		const result = await deleteProduct(productId);

		expect(result).toEqual(responseData);
	});

	it("Throw an error when product ID is missing", async () => {
		mock.onGet(`http://localhost:8000/product/delete`).reply(404);
		await expect(deleteProduct("")).rejects.toThrow("Missing product id");
	});

	it("Throw an error when adminToken is missing", async () => {
		const productId = "valid_product_id";
		Cookies.get = jest.fn().mockReturnValue(null);
		mock.onDelete("http://localhost:8000/product/delete", {
			data: { _id: productId },
		});

		await expect(deleteProduct(productId)).rejects.toThrow("Missing authorization");
	});

	it("Throw an error when product deletion is unsuccessful", async () => {
		const productId = "valid_product_id";
		const adminToken = "valid_admin_token";
		Cookies.set("adminToken", adminToken);

		// Mock the unsuccessful delete request
		mock
			.onDelete("http://localhost:8000/product/delete", {
				headers: { authorization: `Bearer ${adminToken}` },
				data: { _id: productId },
			})
			.reply(500);

		await expect(deleteProduct(productId)).rejects.toThrow(
			"Request failed with status code 500"
		);
	});
});

describe("archiveProduct", () => {
	it("Throw an error when product ID is missing", async () => {
		const archiveStatus = true;
		mock.onGet(`http://localhost:8000/product/archive`).reply(404);
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
});

describe("createNewTransportation", () => {
	it("Create a new transportation successfully", async () => {
		const newTransportation = "Car";
		const carbonCoef = 1.5;
		const responseData = {
			_id: "valid_id",
			mail: "test@example.com",
			token: "valid_token",
		};

		// Mock the successful post request
		mock
			.onPost("http://localhost:8000/product/transportation/create", {
				transportation: newTransportation,
				carbonCoefficient: carbonCoef,
			})
			.reply(200, responseData);

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

		// Mock the unsuccessful post request
		mock
			.onPost("http://localhost:8000/product/transportation/create", {
				transportation: newTransportation,
				carbonCoefficient: carbonCoef,
			})
			.reply(500);

		await expect(createNewTransportation(newTransportation, carbonCoef)).rejects.toThrow(
			"Request failed with status code 500"
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

		// Mock the successful get request
		mock.onGet("http://localhost:8000/transportations").reply(200, responseData);

		const result = await fetchTransportations();
		expect(result).toEqual(responseData.transportations);
	});

	it("Throw an error when no transportations are retrieved", async () => {
		// Mock the successful get request with no transportations data
		mock.onGet("http://localhost:8000/transportations").reply(200, {});

		await expect(fetchTransportations()).rejects.toThrow("No transportations retrieved");
	});

	it("Throw an error when fetching transportations is unsuccessful", async () => {
		// Mock the unsuccessful get request
		mock.onGet("http://localhost:8000/transportations").reply(500);

		await expect(fetchTransportations()).rejects.toThrow(
			"Request failed with status code 500"
		);
	});
});

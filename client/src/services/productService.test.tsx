import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import Cookies from "js-cookie";
import {
	fetchProductById,
	fetchProductsForCache,
	fetchSimilarProducts,
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

	it("should throw an error when no products retrieved", async () => {
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

// describe("fetchProducts", () => {
// 	// Tests for fetchProducts
// });

// describe("createProduct", () => {
// 	// Tests for createProduct
// });

// describe("deleteProduct", () => {
// 	// Tests for deleteProduct
// });

// describe("archiveProduct", () => {
// 	// Tests for archiveProduct
// });

// describe("createNewTransportation", () => {
// 	// Tests for createNewTransportation
// });

// describe("fetchTransportations", () => {
// 	// Tests for fetchTransportations
// });

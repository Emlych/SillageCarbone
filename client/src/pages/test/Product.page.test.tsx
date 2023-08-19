import { render, waitFor, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Product from "../Product.page";
import { fetchProductById, fetchSimilarProducts } from "../../services/productService";

// Mock fetchProductById function
jest.mock("../../services/productService", () => ({
	fetchProductById: jest.fn(),
	fetchSimilarProducts: jest.fn(),
	fetchProductsForCache: jest.fn(),
}));

describe("Product Component", () => {
	const productId = "product-id";
	const productType = { _id: "string", name: "produit de la mer" };

	const mockProduct = {
		_id: productId,
		name: "Product 1",
		productType,
		company: "Company 1",
		co2: 12,
		description: "string",
		imgUrl: "string",
		creation_date: new Date(),
		transportation: "",
		distance: 134,
		origin_harbour: { _id: "string", city: "city1", country: "country1" },
		destination_harbour: { _id: "string", city: "city2", country: "country2" },
	};
	const mockSimilarProducts = [
		{
			_id: productId + 1,
			name: "Similar Product 1",
			company: "Other Company 1",
			co2: 53,
			productType,
		},
		{
			_id: productId + 2,
			name: "Similar Product 2",
			company: "Other Company 1",
			co2: 556,
			productType,
		},
	];

	beforeEach(() => {
		// Clear mock implementation for fetchProductById
		(fetchProductById as jest.Mock).mockClear();

		// Mock the return values of the mocked functions
		(fetchProductById as jest.Mock).mockResolvedValue(mockProduct);
		(fetchSimilarProducts as jest.Mock).mockResolvedValue(mockSimilarProducts);
	});

	it("Render product details and caroussel of similar products", async () => {
		render(
			<MemoryRouter initialEntries={[`/products/1`]}>
				<Routes>
					<Route path="/products/:_id" element={<Product />} />
				</Routes>
			</MemoryRouter>
		);

		// Wait for the component to load and render
		await waitFor(() => {
			expect(screen.getByText(/Product 1/i)).toBeInTheDocument();
		});
		await waitFor(() => {
			expect(screen.getByText(/Similar Product 1/i)).toBeInTheDocument();
		});
		await waitFor(() => {
			expect(screen.getByText(/Similar Product 2/i)).toBeInTheDocument();
		});
	});

	it("Displays an error toast when fetching product data fails", async () => {
		// Mock fetchProductById to simulate an error
		(fetchProductById as jest.Mock).mockRejectedValue(new Error("Fetching error"));

		render(
			<MemoryRouter initialEntries={[`/products/1`]}>
				<Routes>
					<Route path="/products/:_id" element={<Product />} />
				</Routes>
			</MemoryRouter>
		);

		// Wait for the component to attempt to fetch data and handle the error
		await waitFor(() => {
			expect(
				screen.getByText(
					/Le produit recherché n'a pu être extrait de la base de données./i
				)
			).toBeInTheDocument();
		});

		// Check if the error toast is displayed
		expect(screen.getByRole("alert")).toBeInTheDocument();
	});

	it("Displays an error toast when fetching similar products fails", async () => {
		// Mock fetchSimilarProducts to simulate an error
		(fetchSimilarProducts as jest.Mock).mockRejectedValue(new Error("Fetching error"));

		render(
			<MemoryRouter initialEntries={[`/products/1`]}>
				<Routes>
					<Route path="/products/:_id" element={<Product />} />
				</Routes>
			</MemoryRouter>
		);

		// Wait for the component to attempt to fetch data and handle the error
		await waitFor(() => {
			expect(
				screen.getByText(/Erreur dans l'extraction de produits du même type./i)
			).toBeInTheDocument();
		});

		// Check if the error toast is displayed
		expect(screen.getByRole("alert")).toBeInTheDocument();
		// Check if the caroussel loading state is set to false after the error
		expect(screen.queryByTestId("caroussel-loading")).not.toBeInTheDocument();
	});
});

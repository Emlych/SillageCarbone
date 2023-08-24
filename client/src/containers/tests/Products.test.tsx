import { render, fireEvent, screen, act } from "@testing-library/react";
import Products from "../BackOffice/Products";
import { fetchProducts } from "../../services/productService";
import React from "react";

// Mock the fetchProducts service
jest.mock("../../services/productService", () => ({
	fetchProducts: jest.fn(),
}));

// Mock list of products
const mockProducts = [
	{ _id: "1", name: "Boîte de thon", company: "Petit navire", co2: 140 },
	{
		_id: "2",
		name: "Boîte de thon à l'huile de tournesol",
		company: "Compagnie du Thonitruant",
		co2: 200,
	},
	{ _id: "3", name: "Maquillage à l'algue", company: "Algue Moi", co2: 200 },
	{ _id: "4", name: "Boîte de thon à la tomate", company: "Saw Piquette", co2: 200 },
	{ _id: "5", name: "Boîte de thon 1", company: "Petit navire 1", co2: 200 },
	{ _id: "6", name: "Boîte de thon 2", company: "Petit navire 2", co2: 200 },
];

describe("Products Backoffice", () => {
	beforeAll(() => {
		Object.defineProperty(window, "location", {
			configurable: true,
			value: { reload: jest.fn() },
		});
	});

	afterAll(() => {
		Object.defineProperty(window, "location", {
			configurable: true,
			value: window.location,
		});
	});

	it("Products component renders correctly", () => {
		render(<Products />);

		// Check if the page title is rendered
		const pageTitle = screen.getByText("Liste des produits");
		expect(pageTitle).toBeInTheDocument();

		// Check if the filter labels are rendered
		const filterLabels = ["Nom de produit", "Marque", "Quantité par page:"];
		filterLabels.forEach((label) => {
			const filterLabel = screen.getByText(label);
			expect(filterLabel).toBeInTheDocument();
		});
	});

	it("Filter by product name", () => {
		render(<Products />);

		// Find the search input
		const searchInput = screen.getByTestId("product-name") as HTMLInputElement;

		// Simulate user input in the search input
		fireEvent.change(searchInput, { target: { value: "jambon" } });

		// Check if the search input value has changed
		expect(searchInput.value).toBe("jambon");
	});
	it("Filter by product company", () => {
		render(<Products />);

		// Find the search input
		const searchInput = screen.getByTestId("company") as HTMLInputElement;

		// Simulate user input in the search input
		fireEvent.change(searchInput, { target: { value: "compagnie du jambon" } });

		// Check if the search input value has changed
		expect(searchInput.value).toBe("compagnie du jambon");
	});

	it("Displays products filtered by name correctly", async () => {
		// Mock the fetchProducts function to return the mockProducts
		(fetchProducts as jest.Mock).mockResolvedValue({
			products: mockProducts,
			count: mockProducts.length,
		});

		render(<Products />);

		// Find the search input
		const searchInput = screen.getByTestId("product-name") as HTMLInputElement;

		// Simulate user input in the search input
		const filterValue = "thon";
		fireEvent.change(searchInput, { target: { value: filterValue } });

		// Wait for the component to finish rendering with the filtered products
		await screen.findAllByText("Boîte de thon");

		// Assert that the filtered product is displayed
		const filteredProduct_1 = screen.getByText(mockProducts[0].name);
		expect(filteredProduct_1).toBeInTheDocument();

		// Assert that the filtered product is displayed
		const filteredProduct_2 = screen.getByText(mockProducts[1].name);
		expect(filteredProduct_2).toBeInTheDocument();
	});

	it("Displays correct products on pagination change", async () => {
		// Mock the fetchProducts function to return the mockProducts
		(fetchProducts as jest.Mock).mockResolvedValue({
			products: mockProducts,
			count: mockProducts.length,
		});

		render(<Products />);

		// Find the search input
		const searchInput = screen.getByTestId("product-name") as HTMLInputElement;

		// Simulate user input in the search input
		const filterValue = "thon";
		fireEvent.change(searchInput, { target: { value: filterValue } });

		// Wait for the component to finish rendering with the initial products
		await screen.findAllByText("Boîte de thon");

		// Simulate clicking the "Next" button
		fireEvent.click(screen.getByTestId("next-button"));

		// Wait for the component to finish rendering with the next set of products
		await screen.findAllByText("Maquillage à l'algue");

		// Assert that the correct product is displayed on the new page
		const productOnNewPage = screen.getByText("Maquillage à l'algue");
		expect(productOnNewPage).toBeInTheDocument();
	});

	it("Toggles action modals correctly", async () => {
		// Mock the fetchProducts function to return the mockProducts
		(fetchProducts as jest.Mock).mockResolvedValue({
			products: mockProducts,
			count: mockProducts.length,
		});

		render(<Products />);

		// Wait for the component to finish rendering with the initial products
		await screen.findAllByText("Boîte de thon");

		// Find all buttons with the text "Archiver"
		const archiveButtons = screen.getAllByTestId("submit");
		expect(archiveButtons[0]).toBeInTheDocument();
	});
});

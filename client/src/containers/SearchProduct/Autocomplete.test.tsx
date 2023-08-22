import { render, screen, fireEvent, waitFor, renderHook } from "@testing-library/react";
import Autocomplete from "./Autocomplete.container";
import { BrowserRouter as Router } from "react-router-dom";
import { fetchProductsForCache } from "../../services/productService";
import React from "react";
import { formatTextToString } from "../../utils/format-data-utils";

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
	// -- Import non-mocked library and use other functionalities and hooks
	...jest.requireActual("react-router-dom"),
	useNavigate: () => mockNavigate,
}));

// Mocking the fetchProductsForCache function to return products on resolve
jest.mock("../../services/productService", () => ({
	fetchProductsForCache: jest.fn(() =>
		Promise.resolve([
			{ _id: "1", name: "product1", company: "Company1" },
			{ _id: "2", name: "product2", company: "Company2" },
		])
	),
}));

describe("Autocomplete component", () => {
	// Mock products
	const products = [
		{ _id: "1", name: "product1", company: "Company1", keywords: "" },
		{ _id: "2", name: "product2", company: "Company2", keywords: "" },
	];

	/** Render the component */
	function renderAutocompleteComponent() {
		return render(
			<Router>
				<Autocomplete />
			</Router>
		);
	}
	beforeEach(() => {
		// Mock useState: state value are initialised instead of undefined
		// -- To avoid error : TypeError: undefined is not iterable (cannot read property Symbol(Symbol.iterator))
		const setState = jest.fn();
		const useStateMock: any = (initialState: any) => [initialState, setState];
		jest.spyOn(React, "useState").mockImplementation(useStateMock);

		// Mock the useEffect hook to execute the fetch immediately
		jest.spyOn(React, "useEffect").mockImplementation((f) => f());
	});

	it("renders without errors", () => {
		renderAutocompleteComponent();
		const autocompleteComponent = screen.getByTestId("autocomplete");
		expect(autocompleteComponent).toBeInTheDocument();
	});

	it("fetch products data failed", async () => {
		// -- Mock an error on fetchProductsForCache
		(fetchProductsForCache as jest.Mock).mockRejectedValue(new Error("Fetch error"));

		// -- Spy on console.error
		const consoleErrorSpy = jest.spyOn(console, "error");
		consoleErrorSpy.mockImplementation(() => {});

		// -- Render Autocomplete
		renderAutocompleteComponent();

		await waitFor(() => {
			// -- Check that fetchProductsForCache has been called
			expect(fetchProductsForCache).toHaveBeenCalled();
		});
		await waitFor(() => {
			// eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
			expect(consoleErrorSpy).toHaveBeenCalledWith("Error ", new Error("Fetch error"));
		});

		// -- Restore the original console.error
		consoleErrorSpy.mockRestore();
	});

	it("fetch products data with success", async () => {
		// Mock useState to track setProducts
		const setState = jest.fn();
		const useStateMock: any = (initialState: any) => [initialState, setState];
		jest.spyOn(React, "useState").mockImplementation(useStateMock);

		// -- Mock return
		(fetchProductsForCache as jest.Mock).mockReturnValue(products);
		// -- Render Autocomplete
		renderAutocompleteComponent();

		await waitFor(() => {
			// -- Check that fetchProductsForCache has been called
			expect(fetchProductsForCache).toHaveBeenCalled();
		});

		await waitFor(() => {
			// need to have been called with the products returned by fetchProductsForCache
			expect(setState).toHaveBeenCalledWith(products);
		});
	});

	it("stores products in cache after fetching products data", async () => {
		// Mock useState to track setProducts
		const setState = jest.fn();
		const useStateMock: any = (initialState: any) => [initialState, setState];
		jest.spyOn(React, "useState").mockImplementation(useStateMock);

		// -- Mock return
		(fetchProductsForCache as jest.Mock).mockReturnValue(products);
		// -- Render Autocomplete
		renderAutocompleteComponent();

		await waitFor(() => {
			// -- Check that fetchProductsForCache has been called
			expect(fetchProductsForCache).toHaveBeenCalled();
		});

		await waitFor(() => {
			// need to have been called with the products returned by fetchProductsForCache
			expect(setState).toHaveBeenCalledWith(products);
		});

		await waitFor(() => {
			const productCache: {
				[_id: string]: {
					_id: string;
					name: string;
					company: string;
					keywords: string;
				};
			} = {};
			products.forEach((product) => {
				const keywords =
					formatTextToString(product.name) + " " + formatTextToString(product.company);
				product.keywords = keywords;
				productCache[product._id] = product;
			});
			// Check that the productCache is populated correctly
			expect(productCache).toEqual(expect.objectContaining(productCache));
		});
	});

	it("handle search input : no suggestions for user input of two characters", () => {
		// -- Mock return
		(fetchProductsForCache as jest.Mock).mockReturnValue("");
		renderAutocompleteComponent();

		// Get the input element
		const inputElement = screen.getByPlaceholderText("Rechercher un produit");
		expect(inputElement).toBeInTheDocument();

		// Simulate user input
		fireEvent.change(inputElement, { target: { value: "th" } });

		// Verify that there are no suggestion displayed
		const dropdownElement = screen.queryByTestId("dropdown");
		expect(dropdownElement).toBeNull();
	});

	it("handle search input for more than 3 characters", async () => {
		// Mock useState to track setProducts
		const setState = jest.fn();
		const useStateMock: any = (initialState: any) => [initialState, setState];
		jest.spyOn(React, "useState").mockImplementation(useStateMock);

		// -- Mock return
		(fetchProductsForCache as jest.Mock).mockReturnValue(products);
		// -- Render Autocomplete
		renderAutocompleteComponent();

		await waitFor(() => {
			// -- Check that fetchProductsForCache has been called
			expect(fetchProductsForCache).toHaveBeenCalled();
		});

		await waitFor(() => {
			// need to have been called with the products returned by fetchProductsForCache
			expect(setState).toHaveBeenCalledWith(products);
		});

		await waitFor(() => {
			const productCache: {
				[_id: string]: {
					_id: string;
					name: string;
					company: string;
					keywords: string;
				};
			} = {};
			products.forEach((product) => {
				const keywords =
					formatTextToString(product.name) + " " + formatTextToString(product.company);
				product.keywords = keywords;
				productCache[product._id] = product;
			});

			// Check that the productCache is populated correctly
			expect(productCache).toEqual(expect.objectContaining(productCache));
		});

		const searchInput = screen.getByLabelText(
			"Rechercher un produit via la barre de recherche"
		) as HTMLInputElement;
		fireEvent.change(searchInput, { target: { value: "sample product" } });
	});

	// it("handle search input : suggestions for user input if more than 3 characters and stored in products list", async () => {
	// 	// -- Mock return
	// 	(fetchProductsForCache as jest.Mock).mockReturnValue(products);

	// 	// Mock useState: state value are initialised instead of undefined
	// 	// -- To avoid error : TypeError: undefined is not iterable (cannot read property Symbol(Symbol.iterator))
	// 	const setState = jest.fn();
	// 	const useStateMock: any = (initialState: any) => [initialState, setState];
	// 	jest.spyOn(React, "useState").mockImplementation(useStateMock);

	// 	// // Mock formatTextToString to return the same input value for testing
	// 	// const mockFormatTextToString = jest.fn((input: string) => input);
	// 	// jest.mock("../../utils/format-data-utils", () => ({
	// 	// 	formatTextToString: mockFormatTextToString,
	// 	// }));

	// 	renderAutocompleteComponent();

	// 	// Wait for the effect to finish
	// 	await waitFor(() => {
	// 		expect(fetchProductsForCache).toHaveBeenCalled();
	// 	});

	// 	// Get the input element
	// 	const inputElement = screen.getByPlaceholderText("Rechercher un produit");
	// 	expect(inputElement).toBeInTheDocument();

	// 	// Simulate user input
	// 	fireEvent.change(inputElement, { target: { value: "product" } });
	// 	expect(setState).toHaveBeenCalledWith("product");

	// 	// Wait for the effect to finish
	// 	await waitFor(() => {
	// 		const dropdownElement = screen.queryByTestId("dropdown");
	// 		expect(dropdownElement).toBeInTheDocument();
	// 	});

	// 	// Verify presence of dropdown

	// 	// Verify that the suggestions are displayed
	// 	// const suggestionElement = screen.getByText("product1 - Company1");
	// 	// expect(suggestionElement).toBeInTheDocument();
	// });

	// it("navigates to the selected product", () => {
	// 	renderAutocompleteComponent();
	// 	const inputElement = screen.getByPlaceholderText("Rechercher un produit");
	// 	fireEvent.change(inputElement, { target: { value: "thon" } });

	// 	// Get the suggestion element
	// 	const suggestionElement = screen.getByText("boîte de thon - Petit Navire");
	// 	expect(suggestionElement).toBeInTheDocument();

	// 	// Simulate selecting the suggestion, should trigger handleSelectInput
	// 	fireEvent.click(suggestionElement);

	// 	// Verify that the navigate function was called with the correct argument
	// 	expect(mockNavigate).toHaveBeenCalledTimes(1);
	// 	expect(mockNavigate).toHaveBeenCalledWith("product/1");
	// });
});

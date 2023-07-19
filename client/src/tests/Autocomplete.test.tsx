// // Test if autocompletion works with mocks list of product
// const mockProductsData = ["thon", "boite", "chocolat", "thon rouge"];

import { render, screen, fireEvent } from "@testing-library/react";
import Autocomplete from "../containers/SearchProduct/Autocomplete.container";
import { BrowserRouter as Router } from "react-router-dom";

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	useNavigate: () => {
		return mockNavigate;
	},
}));

describe("Autocomplete component", () => {
	function renderAutocompleteComponent() {
		return render(
			<Router>
				<Autocomplete />
			</Router>
		);
	}

	test("no suggestions for user input of two characters", () => {
		renderAutocompleteComponent();
		// Get the input element
		const inputElement = screen.getByPlaceholderText("Rechercher un produit");
		// Simulate user input
		fireEvent.change(inputElement, { target: { value: "th" } });
		// Verify that there are no suggestion displayed
		const dropdownElement = screen.queryByTestId("dropdown");
		expect(dropdownElement).toBeNull();
	});

	test("displays suggestions based on user input", () => {
		renderAutocompleteComponent();
		// Get the input element
		const inputElement = screen.getByPlaceholderText("Rechercher un produit");
		// Simulate user input
		fireEvent.change(inputElement, { target: { value: "thon" } });

		// Verify that the suggestions are displayed
		const suggestionElement = screen.getByText("boîte de thon - Petit Navire");
		expect(suggestionElement).toBeInTheDocument();
	});

	test("no suggestions for user input that's not in the mock list", () => {
		renderAutocompleteComponent();
		const inputElement = screen.getByPlaceholderText("Rechercher un produit");
		fireEvent.change(inputElement, { target: { value: "plante" } });

		// Verify that there are no suggestion displayed
		const dropdownElement = screen.queryByTestId("dropdown");
		expect(dropdownElement).toBeNull();
	});

	test("navigates to the selected product", () => {
		renderAutocompleteComponent();
		const inputElement = screen.getByPlaceholderText("Rechercher un produit");
		fireEvent.change(inputElement, { target: { value: "thon" } });

		// Get the suggestion element
		const suggestionElement = screen.getByText("boîte de thon - Petit Navire");
		expect(suggestionElement).toBeInTheDocument();

		// Simulate selecting the suggestion, should trigger handleSelectInput
		fireEvent.click(suggestionElement);

		// Verify that the navigate function was called with the correct argument
		expect(mockNavigate).toHaveBeenCalledTimes(1);
		expect(mockNavigate).toHaveBeenCalledWith("product/1");
	});
});

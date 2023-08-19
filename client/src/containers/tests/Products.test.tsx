import { render, fireEvent, screen } from "@testing-library/react";
import Products from "../BackOffice/Products";

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

it("Displays products filtered by name correctly", () => {
	render(<Products />);

	// Find the search input
	const searchInput = screen.getByTestId("product-name") as HTMLInputElement;

	// Simulate user input in the search input
	const filterValue = "thon";
	fireEvent.change(searchInput, { target: { value: filterValue } });

	// Check if the filtered users are rendered correctly
	const productCards = screen.getAllByTestId("card-item");

	// Extract the mail values from the user cards
	const productNames = productCards.map((card) => card.textContent);

	// Check if the filtered users have the expected mail values
	const expectedProductNames = ["Boîte de thon", "Boîte de gros thon massif"];
	expectedProductNames.forEach((name) => {
		expect(productNames).toContain(name);
	});
});

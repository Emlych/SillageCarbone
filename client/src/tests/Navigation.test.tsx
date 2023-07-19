import { render, fireEvent, screen } from "@testing-library/react";
import Navigation from "../containers/BackOffice/Backoffice_navigation";

test("Navigation component renders correctly", () => {
	const setComponentKey = jest.fn();
	render(<Navigation setComponentKey={setComponentKey} />);

	// Check if menu items are rendered correctly
	const usersMenuItem = screen.getByText("Comptes utilisateurs");
	expect(usersMenuItem).toBeInTheDocument();

	const createUserMenuItem = screen.getByText("Créer un compte");
	expect(createUserMenuItem).toBeInTheDocument();

	const productsMenuItem = screen.getByText("Products");
	expect(productsMenuItem).toBeInTheDocument();

	const createProductMenuItem = screen.getByText("Créer un produit");
	expect(createProductMenuItem).toBeInTheDocument();

	// Simulate a click event on the "Créer un compte" menu item
	fireEvent.click(createUserMenuItem);

	// Check if setComponentKey is called with the correct value
	expect(setComponentKey).toHaveBeenCalledWith("create-user");
});

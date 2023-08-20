import { render, fireEvent, screen } from "@testing-library/react";
import Navigation from "../BackOffice/Backoffice_navigation";

describe("Backoffice navigation", () => {
	const keyNames = [
		{ key: "users", name: "Comptes utilisateurs" },
		{ key: "users", name: "Gestion des comptes" },
		{ key: "create-user", name: "Créer un compte" },
		{ key: "products", name: "Produits" },
		{ key: "products", name: "Gestion des produits" },
		{ key: "create-product", name: "Créer un produit" },
		{ key: "archived-products", name: "Produits archivés" },
		{ key: "product-keys", name: "Gestion des catégories" },
	];

	it("Navigation component renders correctly", () => {
		const setComponentKey = jest.fn();
		render(<Navigation setComponentKey={setComponentKey} />);

		// Check if menu items are rendered correctly
		for (const keyName of keyNames) {
			const menuItem = screen.getByText(keyName.name);
			expect(menuItem).toBeInTheDocument();
		}
	});

	it("Click on item will set component key", () => {
		const setComponentKey = jest.fn();
		render(<Navigation setComponentKey={setComponentKey} />);

		for (const keyName of keyNames) {
			const menuItem = screen.getByText(keyName.name);
			// Simulate a click event on the "Créer un compte" menu item

			fireEvent.click(menuItem);
			// Check if setComponentKey is called with the correct value
			expect(setComponentKey).toHaveBeenCalledWith(keyName.key);
		}
	});

	it("Click on item will call handleNavItemClick", () => {
		const setComponentKey = jest.fn();
		render(<Navigation setComponentKey={setComponentKey} />);

		for (const keyName of keyNames) {
			const menuItem = screen.getByText(keyName.name);
			// Simulate a click event on the "Créer un compte" menu item

			fireEvent.click(menuItem);
			// Check if the URL hash is updated correctly
			expect(window.location.hash).toBe(`#${keyName.key}`);
		}
	});
});

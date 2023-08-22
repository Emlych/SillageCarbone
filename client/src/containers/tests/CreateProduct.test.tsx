import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import React from "react";
import CreateProduct from "../BackOffice/CreateProduct";
import { createProduct } from "../../services/productService";
import { toast } from "react-toastify";

jest.mock("../../services/productService", () => ({
	createProduct: jest.fn(),
	fetchTransportations: jest.fn(),
}));
jest.mock("react-toastify");

describe("CreateProduct Container", () => {
	it("Renders the component without error", () => {
		render(<CreateProduct />);

		const h2 = screen.getByText("Créer un nouveau produit");
		expect(h2).toBeInTheDocument();

		const submitFormButton = screen.getByText("Valider");
		expect(submitFormButton).toBeInTheDocument();
	});

	it("Update text field input value", () => {
		// Mock useState to track setMail function
		const setState = jest.fn();
		const useStateMock: any = (initialState: any) => [initialState, setState];
		jest.spyOn(React, "useState").mockImplementation(useStateMock);

		render(<CreateProduct />);

		const fieldToTest = [
			"name",
			"company",
			"type",
			"port-ville-origine",
			"port-pays-origine",
			"port-ville-arrivee",
			"port-pays-arrivee",
			"description",
		];
		for (const field of fieldToTest) {
			const nameInput = screen.getByTestId(field);
			fireEvent.change(nameInput, { target: { value: field } });
			expect(setState).toHaveBeenCalledWith(field);
		}
	});

	// it("initForm", () => {
	// 	// Mock useState to track setMail function
	// 	const setState = jest.fn();
	// 	const useStateMock: any = (initialState: any) => [initialState, setState];
	// 	jest.spyOn(React, "useState").mockImplementation(useStateMock);

	// 	// Mock the return values of createProduct
	// 	const mockProduct = {
	// 		_id: "productId",
	// 		product_name: "productName",
	// 		company: "company",
	// 		co2: 10,
	// 	};
	// 	(createProduct as jest.Mock).mockResolvedValue({ success: true, data: mockProduct });
	// 	render(<CreateProduct />);

	// 	// Simulate form submission
	// 	const submitFormButton = screen.getByText("Valider");
	// 	fireEvent.click(submitFormButton);

	// 	// Check that initForm was triggered
	// 	// -- COMPLETE TEST HERE
	// });

	it("On handleFormSubmit fetchData success, display toast with ok message", async () => {
		// Mock useState to track setMail function
		const setState = jest.fn();
		const useStateMock: any = (initialState: any) => [initialState, setState];
		jest.spyOn(React, "useState").mockImplementation(useStateMock);

		// Mock the return values of createProduct
		const mockProduct = {
			_id: "productId",
			name: "productName",
			company: "company",
			co2: 10,
			type: "type",
			originCity: "originCity",
			originCountry: "originCountry",
			destinationCity: "destinationCity",
			destinationCountry: "destinationCountry",
			transportation: "transportation",
			description: "description",
			picture: "picture",
		};
		(createProduct as jest.Mock).mockResolvedValue({ success: true, data: mockProduct });
		render(<CreateProduct />);

		// Fill in form fields
		const nameInput = screen.getByTestId("name") as HTMLInputElement;
		fireEvent.change(nameInput, { target: { value: mockProduct.name } });
		expect(setState).toHaveBeenCalledWith(mockProduct.name);
		//TODO correct behaviour avec setProductName
		expect(nameInput.value).toBe(mockProduct.name);

		// Simulate form submission
		const submitFormButton = screen.getByText("Valider");
		fireEvent.click(submitFormButton);

		await waitFor(() => {
			// Check if createProduct function is called with the mock product
			expect(createProduct).toHaveBeenCalledWith(mockProduct);
		});

		// Check if toast is called with the success message
		await waitFor(() => {
			expect(toast).toHaveBeenCalledWith(
				`Création du produit ${mockProduct.name} - ${mockProduct.company}`
			);
		});
	});

	it("Form submission works with toast error", async () => {
		// Mock useState to track setMail function
		const setState = jest.fn();
		const useStateMock: any = (initialState: any) => [initialState, setState];
		jest.spyOn(React, "useState").mockImplementation(useStateMock);

		(createProduct as jest.Mock).mockResolvedValue({ success: false, data: null });
		render(<CreateProduct />);

		// Simulate form submission
		const submitFormButton = screen.getByText("Valider");
		fireEvent.click(submitFormButton);

		// Check if toast is called with the error message
		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith(`Erreur dans la création du produit`);
		});
	});
});

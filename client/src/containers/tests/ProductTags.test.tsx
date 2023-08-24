import { render, fireEvent, screen, act } from "@testing-library/react";
import {
	createNewTransportation,
	fetchTransportations,
	deleteTransportation,
} from "../../services/productService";
import ProductTags from "../BackOffice/ProductTags";

// Mock the productService methods
jest.mock("../../services/productService", () => ({
	createNewTransportation: jest.fn(),
	fetchTransportations: jest.fn(),
	deleteTransportation: jest.fn(),
}));

describe("ProductTags Component", () => {
	it("Renders the component correctly", () => {
		render(<ProductTags />);

		const heading = screen.getByText("Gestion des catégories");
		expect(heading).toBeInTheDocument();

		// Add more assertions based on your component's rendering
	});

	it("Allows creating a new transportation", async () => {
		render(<ProductTags />);

		const transportationInput = screen.getByTestId("transportation");
		const carbonCoefInput = screen.getByTestId("carbonCoef");
		const submitButton = screen.getByText("Valider");

		// Simulate user input
		fireEvent.change(transportationInput, { target: { value: "Car" } });
		fireEvent.change(carbonCoefInput, { target: { value: "1.5" } });

		// Mock createNewTransportation method
		(createNewTransportation as jest.Mock).mockReturnValueOnce("");

		// Trigger form submission
		fireEvent.click(submitButton);

		// Ensure createNewTransportation method was called with the correct arguments
		expect(createNewTransportation).toHaveBeenCalledWith("Car", 1.5);
	});

	it("Allows deleting a transportation", async () => {
		const mockTransportations = [{ _id: "1", name: "Voilier", carbonCoefficient: 1.5 }];

		// Mock fetchTransportations method
		(fetchTransportations as jest.Mock).mockResolvedValue(mockTransportations);

		render(<ProductTags />);

		// Mock deleteTransportation method
		(deleteTransportation as jest.Mock).mockReturnValueOnce({ success: true });

		await screen.findByText("Voilier - coef:1.5");

		// Find the delete icon container
		const deleteIconContainer = screen.getByTestId("delete-icon-container");
		// Trigger the click event on the delete icon container
		fireEvent.click(deleteIconContainer);

		// Ensure deleteTransportation method was called with the correct arguments
		expect(deleteTransportation).toHaveBeenCalled();
		expect(deleteTransportation).toHaveBeenCalledWith("1");

		// Mock delete success, and refetch the transportations
		(fetchTransportations as jest.Mock).mockResolvedValue([]);
		// eslint-disable-next-line testing-library/no-unnecessary-act
		await act(async () => {
			fireEvent.click(deleteIconContainer);
		});
	});
});

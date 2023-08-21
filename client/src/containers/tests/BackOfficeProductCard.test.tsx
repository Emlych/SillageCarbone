import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BackofficeProductCard from "../BackOffice/BackofficeProductCard";
import { capitalizeFirstLetter } from "../../utils/format-data-utils";

jest.mock("../../services/userService", () => ({
	fetchUsers: jest.fn(),
}));

describe("Users Container", () => {
	const mockProduct = {
		_id: "productId",
		product_name: "productName",
		company: "company",
		co2: 10,
	};

	it("renders component without error", () => {
		const openConfirmActionModal = jest.fn();
		render(
			<BackofficeProductCard
				openConfirmActionModal={openConfirmActionModal}
				actionType="archive"
				_id="productId"
				product_name="productName"
				company="company"
				co2={10}
			/>
		);

		const toCapitalizeText = [mockProduct.product_name, mockProduct.company];
		for (const text of toCapitalizeText) {
			const mockText = capitalizeFirstLetter(text);
			const expectedText = screen.getByText(mockText);
			expect(expectedText).toBeInTheDocument();
		}

		const co2Value = screen.getByText(`${mockProduct.co2} eq CO2`);
		expect(co2Value).toBeInTheDocument();

		const archiveButton = screen.getByText("Archiver");
		expect(archiveButton).toBeInTheDocument();
	});

	it("renders unarchive button with delete component without error", () => {
		const openConfirmActionModal = jest.fn();
		render(
			<BackofficeProductCard
				openConfirmActionModal={openConfirmActionModal}
				actionType="delete"
				_id="productId"
				product_name="productName"
				company="company"
				co2={10}
			/>
		);

		const unarchiveButton = screen.getByText("Désarchiver");
		expect(unarchiveButton).toBeInTheDocument();
	});

	it("calls openConfirmActionModal when click on unarchive button", async () => {
		const openConfirmActionModal = jest.fn();
		render(
			<BackofficeProductCard
				openConfirmActionModal={openConfirmActionModal}
				actionType="delete"
				_id="productId"
				product_name="productName"
				company="company"
				co2={10}
			/>
		);

		const unarchiveButton = screen.getByText("Désarchiver");
		fireEvent.click(unarchiveButton);

		expect(openConfirmActionModal).toBeCalled();
	});

	it("calls openConfirmActionModal when click on archive button", async () => {
		const openConfirmActionModal = jest.fn();
		render(
			<BackofficeProductCard
				openConfirmActionModal={openConfirmActionModal}
				actionType="archive"
				_id="productId"
				product_name="productName"
				company="company"
				co2={10}
			/>
		);

		const archiveButton = screen.getByText("Archiver");
		fireEvent.click(archiveButton);

		expect(openConfirmActionModal).toBeCalled();
	});

	// it("displays user cards after data is loaded", async () => {
	// 	// Mock the return values of fetchUsers
	// 	(fetchUsers as jest.Mock).mockResolvedValue({
	// 		users: mockUsers,
	// 		count: mockUsers.length,
	// 	});
	// 	render(<Users />);

	// 	// Wait for user cards to be displayed
	// 	const userCards = await screen.findAllByTestId("user-card");
	// 	expect(userCards).toHaveLength(mockUsers.length);
	// });

	// it("updates filter input value when user types into the input field", () => {
	// 	render(<Users />);
	// 	// Find the input field by its data-testid
	// 	const inputField = screen.getByTestId("search-word") as HTMLInputElement;
	// 	// Simulate user typing into the input field
	// 	fireEvent.change(inputField, { target: { value: "search text" } });
	// 	// Check if the input field's value has been updated
	// 	expect(inputField.value).toBe("search text");
	// });

	// it("updates start date filter when user selects a date in the DateInput component", async () => {
	// 	// Mock the return values of fetchUsers
	// 	(fetchUsers as jest.Mock).mockResolvedValue({
	// 		users: mockUsers,
	// 		count: mockUsers.length,
	// 	});
	// 	render(<Users />);
	// 	// Find the start date input field by its type attribute
	// 	const startDateInput = screen.getByTestId("custom-date-start");
	// 	// Simulate user selecting a date in the input field
	// 	fireEvent.change(startDateInput, { target: { value: "2023-05-10" } });

	// 	// Wait for user cards to be displayed
	// 	const userCardMails = await screen.findAllByTestId("user-card-mail");
	// 	// Check if the filtered users are displayed
	// 	const displayedUserEmails = userCardMails.map((card) => card.textContent);
	// 	const expectedUserEmails = ["user3@example.com"]; // Only the third user matches the filter
	// });
});

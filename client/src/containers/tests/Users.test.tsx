import { render, screen, fireEvent } from "@testing-library/react";
import Users from "../BackOffice/Users";
import { fetchUsers } from "../../services/userService";

jest.mock("../../services/userService", () => ({
	fetchUsers: jest.fn(),
}));

describe("Users Container", () => {
	const mockUsers = [
		{ mail: "user1@example.com", creation_date: "2022-08-01" },
		{ mail: "user2@example.com", creation_date: "2022-08-02" },
		{ mail: "user3@example.com", creation_date: "2023-05-15" },
	];

	it("renders loading state initially", () => {
		render(<Users />);
		const loadingMessage = screen.getByText("En cours de chargement...");
		expect(loadingMessage).toBeInTheDocument();
	});

	it("displays user cards after data is loaded", async () => {
		// Mock the return values of fetchUsers
		(fetchUsers as jest.Mock).mockResolvedValue({
			users: mockUsers,
			count: mockUsers.length,
		});
		render(<Users />);

		// Wait for user cards to be displayed
		const userCards = await screen.findAllByTestId("user-card");
		expect(userCards).toHaveLength(mockUsers.length);
	});

	it("opens delete modal when delete button is clicked", async () => {
		// Mock the return values of fetchUsers
		(fetchUsers as jest.Mock).mockResolvedValue({ users: mockUsers, count: 2 });
		render(<Users />);

		// Get all deleteButtons
		const deleteButtons = await screen.findAllByTestId("submit");
		// Click on the first delete button
		fireEvent.click(deleteButtons[0]);

		// Check if delete modal is opened
		const deleteModal = await screen.findByTestId("modal-backdrop");
		expect(deleteModal).toBeInTheDocument();
	});

	it("updates filter input value when user types into the input field", () => {
		render(<Users />);
		// Find the input field by its data-testid
		const inputField = screen.getByTestId("search-word") as HTMLInputElement;
		// Simulate user typing into the input field
		fireEvent.change(inputField, { target: { value: "search text" } });
		// Check if the input field's value has been updated
		expect(inputField.value).toBe("search text");
	});

	it("updates start date filter when user selects a date in the DateInput component", async () => {
		// Mock the return values of fetchUsers
		(fetchUsers as jest.Mock).mockResolvedValue({
			users: mockUsers,
			count: mockUsers.length,
		});
		render(<Users />);
		// Find the start date input field by its type attribute
		const startDateInput = screen.getByTestId("custom-date-start");
		// Simulate user selecting a date in the input field
		fireEvent.change(startDateInput, { target: { value: "2023-05-10" } });

		// Wait for user cards to be displayed
		const userCardMails = await screen.findAllByTestId("user-card-mail");
		// Check if the filtered users are displayed
		const displayedUserEmails = userCardMails.map((card) => card.textContent);
		const expectedUserEmails = ["user3@example.com"]; // Only the third user matches the filter
	});
});

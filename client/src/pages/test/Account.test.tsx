import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import Account from "../Account.page";
import { MemoryRouter } from "react-router-dom";
import Cookies from "js-cookie";
import { fetchUserByMail } from "../../services/userService";

const mockUserToken = "user-token"; // Mock the admin token value
const mockUserData = {
	mail: "user@example.com",
	creation_date: "2023-08-20T00:00:00Z",
};
jest.mock("../../services/userService", () => ({
	fetchUserByMail: jest.fn(() => Promise.resolve(mockUserData)),
}));

beforeEach(() => {
	// -- Mock method Cookies.get to return the user token
	Cookies.get = jest.fn().mockReturnValue(mockUserToken);
});

describe("Account page", () => {
	it("opens change password modal on button click", () => {
		render(<Account />);
		const changePasswordButton = screen.getByText("Changement du mot de passe");
		fireEvent.click(changePasswordButton);
		const changePasswordModal = screen.getByTestId("change-password-form");
		expect(changePasswordModal).toBeInTheDocument();
	});

	it("opens delete modal on button click", () => {
		render(
			<MemoryRouter>
				<Account />
			</MemoryRouter>
		);
		const deleteAccountButton = screen.getByText("Supprimer");
		fireEvent.click(deleteAccountButton);
		const deleteAccountModal = screen.getByTestId("delete-account-form");
		expect(deleteAccountModal).toBeInTheDocument();

		// Test toggling the modal
		const toggleButton = screen.getByText("Annuler");
		fireEvent.click(toggleButton);
		expect(deleteAccountModal).not.toBeInTheDocument();
	});

	it("opens modify modal on button click", () => {
		render(
			<MemoryRouter>
				<Account />
			</MemoryRouter>
		);
		const modifyAccountButton = screen.getByText("Changement du mot de passe");
		fireEvent.click(modifyAccountButton);
		const modifyAccountModal = screen.getByTestId("change-password-form");
		expect(modifyAccountModal).toBeInTheDocument();

		// Test toggling the modal
		const toggleButton = screen.getByText("Annuler");
		fireEvent.click(toggleButton);
		expect(modifyAccountModal).not.toBeInTheDocument();
	});

	it("fetchUserData working", async () => {
		(fetchUserByMail as jest.Mock).mockResolvedValue(mockUserData);
		render(
			<MemoryRouter>
				<Account />
			</MemoryRouter>
		);

		// Wait for the async operation to complete and user information to be displayed
		await waitFor(() => {
			const userMail = screen.getByText("Mail user : user@example.com");
			expect(userMail).toBeInTheDocument();
		});
		await waitFor(() => {
			const accountDate = screen.getByText("Date de création du compte : 20-08-2023");
			expect(accountDate).toBeInTheDocument();
		});
	});
});

import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect"; // For extended expect matchers
import DeleteAccount from "../Account/DeleteAccount";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { deleteUser } from "../../services/userService";
import { deleteToken } from "../../utils/token-utils";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

// Mocks for dependencies
jest.mock("js-cookie");

// Mocks for dependencies
jest.mock("../../services/userService", () => ({
	deleteUser: jest.fn(() => Promise.resolve()),
}));
jest.mock("../../utils/token-utils", () => ({
	deleteToken: jest.fn(),
}));
jest.mock("react-toastify");
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
	// -- Import non-mocked library and use other functionalities and hooks
	...jest.requireActual("react-router-dom"),
	useNavigate: () => mockNavigate,
}));

describe("Users Container", () => {
	const toggleModal = jest.fn();

	it("DeleteAccount component renders correctly", () => {
		render(
			<BrowserRouter>
				<DeleteAccount toggleModal={() => {}} />
			</BrowserRouter>
		);

		// Check if the main heading is rendered
		expect(screen.getByText("Supprimer mon compte")).toBeInTheDocument();

		// Check if the deletion reason select is rendered
		expect(screen.getByText("Pourquoi supprimez-vous votre compte?")).toBeInTheDocument();

		// Check if the password input is rendered
		expect(
			screen.getByText("Veuillez confirmer votre mot de passe avant de continuer :")
		).toBeInTheDocument();

		// Check if both buttons are rendered
		expect(screen.getByText("Annuler")).toBeInTheDocument();
		expect(screen.getByText("Supprimer définitivement mon compte")).toBeInTheDocument();
	});

	it("Password input works correctly", () => {
		render(
			<BrowserRouter>
				<DeleteAccount toggleModal={() => {}} />
			</BrowserRouter>
		);
		// Get the password input
		const passwordInput = screen.getByTestId("password");
		// Enter a value into the password input
		fireEvent.change(passwordInput, { target: { value: "testpassword" } });
		// Check if the input value is updated
		expect(passwordInput).toHaveValue("testpassword");
	});

	it("calls toggleModal when click on Button Annuler", () => {
		render(
			<BrowserRouter>
				<DeleteAccount toggleModal={toggleModal} />
			</BrowserRouter>
		);
		const cancelButton = screen.getByText("Annuler");
		expect(cancelButton).toBeInTheDocument();
		fireEvent.click(cancelButton);
		expect(toggleModal).toHaveBeenCalledTimes(1);
	});

	it("show password when click on the eye icon", () => {
		render(
			<BrowserRouter>
				<DeleteAccount toggleModal={() => {}} />
			</BrowserRouter>
		);

		// Eye icon
		const eyeIcon = screen.getByTestId("eye-icon");
		expect(eyeIcon).toBeInTheDocument();

		// Password input field
		const passwordInput = screen.getByTestId("password");
		expect(passwordInput).toBeInTheDocument();
		expect(passwordInput).toHaveAttribute("type", "password");

		// Test show password
		fireEvent.click(eyeIcon);
		expect(passwordInput).toHaveAttribute("type", "text");

		// Test hide password
		fireEvent.click(eyeIcon);
		expect(passwordInput).toHaveAttribute("type", "password");
	});

	it("Form submission works correctly", async () => {
		const mockedDeleteUser = deleteUser as jest.Mock;
		const mockedDeleteToken = deleteToken as jest.Mock;

		mockedDeleteUser.mockResolvedValue(""); // Mock a successful deletion

		const toastErrorMock = toast.error as jest.Mock;
		toastErrorMock.mockReturnValue(""); // Mocking the toast.error function

		(Cookies.get as jest.Mock).mockReturnValue("userMailToken");
		render(
			<BrowserRouter>
				<DeleteAccount toggleModal={() => {}} />
			</BrowserRouter>
		);

		// Set a password value
		const passwordInput = screen.getByTestId("password");
		fireEvent.change(passwordInput, { target: { value: "testpassword" } });

		// Click on delete button to trigger the form submission
		const deleteButton = screen.getByText("Supprimer définitivement mon compte");
		fireEvent.click(deleteButton);

		await waitFor(() => {
			// Check if deleteUser function is called with the correct password
			expect(mockedDeleteUser).toHaveBeenCalledWith("testpassword");
		});
		await waitFor(() => {
			// Check if deleteToken function is called
			expect(mockedDeleteToken).toHaveBeenCalled();
		});
		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledTimes(1);
			// Check if useNavigate function is called with "/"
			// eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
			expect(mockNavigate).toHaveBeenCalledWith("/");
		});
		await waitFor(() => {
			// Check if toast.error is not called (indicating success)
			expect(toast.error).not.toHaveBeenCalled();
		});
	});
});

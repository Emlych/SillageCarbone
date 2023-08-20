import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import AdminDeleteAccount from "../BackOffice/AdminDeleteAccount";
import { deleteUserAsAdmin } from "../../services/userService";
import { toast } from "react-toastify";

// Mocks for dependencies
jest.mock("js-cookie");
jest.mock("../../services/userService", () => ({
	deleteUserAsAdmin: jest.fn(),
}));
jest.mock("react-toastify");

describe("AdminDeleteAccount component", () => {
	const toggleModal = jest.fn();

	it("handles form submission correctly", async () => {
		(deleteUserAsAdmin as jest.Mock).mockResolvedValue("");
		render(<AdminDeleteAccount toggleModal={toggleModal} mail="user@example.com" />);

		// Fill in the confirm message input
		const confirmMessageInput = screen.getByTestId("confirm-message");
		fireEvent.change(confirmMessageInput, {
			target: { value: "Je veux supprimer ce compte." },
		});

		// Click the submit button
		const submitButton = screen.getByText("Supprimer définitivement ce compte");
		fireEvent.click(submitButton);

		await waitFor(() => {
			// Ensure deleteUserAsAdmin was called with the correct mail
			expect(deleteUserAsAdmin).toHaveBeenCalledWith("user@example.com");
		});

		// Check if toggleModal is called
		expect(toggleModal).toHaveBeenCalledTimes(1);
		// Check if toast is called with the success message
		expect(toast).toHaveBeenCalledWith("Compte supprimé");
	});

	it("disables the submit button when confirm message is not matching", () => {
		render(<AdminDeleteAccount toggleModal={() => {}} mail="user@example.com" />);

		// Confirm message input
		const confirmMessageInput = screen.getByTestId("confirm-message");

		// Initially, the submit button should be disabled
		const submitButton = screen.getByText("Supprimer définitivement ce compte");
		expect(submitButton).toBeDisabled();

		// Change the confirm message input to a non-matching value
		fireEvent.change(confirmMessageInput, { target: { value: "Invalid message" } });

		// The submit button should still be disabled
		expect(submitButton).toBeDisabled();

		// Change the confirm message input to the correct value
		fireEvent.change(confirmMessageInput, {
			target: { value: "Je veux supprimer ce compte." },
		});

		// The submit button should be enabled
		expect(submitButton).toBeEnabled();
	});

	it("calls toggleModal when click on Button Annuler", () => {
		render(<AdminDeleteAccount toggleModal={toggleModal} mail="user@example.com" />);

		const cancelButton = screen.getByText("Annuler");
		expect(cancelButton).toBeInTheDocument();
		fireEvent.click(cancelButton);
		expect(toggleModal).toHaveBeenCalledTimes(1);
	});

	it("Form submission works with toast error", async () => {
		const mockedDeleteUser = deleteUserAsAdmin as jest.Mock;
		mockedDeleteUser.mockRejectedValue(new Error("Deletion failed")); // Mock a failed deletion
		render(<AdminDeleteAccount toggleModal={toggleModal} mail="user@example.com" />);

		// Fill in the confirm message input
		const confirmMessageInput = screen.getByTestId("confirm-message");
		fireEvent.change(confirmMessageInput, {
			target: { value: "Je veux supprimer ce compte." },
		});

		// Click the submit button
		const submitButton = screen.getByText("Supprimer définitivement ce compte");
		fireEvent.click(submitButton);

		await waitFor(() => {
			// Check if deleteUser function is called with the correct password
			expect(mockedDeleteUser).toHaveBeenCalledWith("user@example.com");
		});

		await waitFor(() => {
			// Check if toast.error is called with the correct error message
			expect(toast.error).toHaveBeenCalledWith("Le compte n'a pas pu être supprimé");
		});
	});
});

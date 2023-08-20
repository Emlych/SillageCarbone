import { BrowserRouter } from "react-router-dom";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import ModifyPassword from "../Account/ModifyAccount";
import { isFormCorrect } from "../../utils/format-data-utils";
import { updateUser } from "../../services/userService";
import { createToken } from "../../utils/token-utils";
import { toast } from "react-toastify";

// Mocks for dependencies
jest.mock("../../services/userService", () => ({
	updateUser: jest.fn(() =>
		Promise.resolve({ token: "newToken", mail: "user@example.com" })
	),
}));
jest.mock("../../utils/format-data-utils", () => ({
	isFormCorrect: jest.fn(() => ({ isCorrect: true, errorMessage: "" })),
}));
jest.mock("../../utils/token-utils", () => ({
	createToken: jest.fn(),
}));
jest.mock("react-toastify");

describe("Modify Account Container", () => {
	const toggleModal = jest.fn();

	it("ModifyAccount component renders correctly", () => {
		render(
			<BrowserRouter>
				<ModifyPassword toggleModal={() => {}} />
			</BrowserRouter>
		);

		expect(screen.getByText("Changer de mot de passe")).toBeInTheDocument();
		expect(screen.getByText("Mot de passe actuel :")).toBeInTheDocument();
		expect(screen.getByText("Nouveau mot de passe :")).toBeInTheDocument();
		expect(screen.getByText("Confirmer le nouveau mot de passe :")).toBeInTheDocument();

		expect(screen.getByText("Modifier le mot de passe")).toBeInTheDocument();
	});

	it("Actual password input works correctly", () => {
		render(
			<BrowserRouter>
				<ModifyPassword toggleModal={() => {}} />
			</BrowserRouter>
		);

		// Get the password input
		const passwordInput = screen.getByTestId("actual-password");
		// Enter a value into the password input
		fireEvent.change(passwordInput, { target: { value: "testpassword" } });
		// Check if the input value is updated
		expect(passwordInput).toHaveValue("testpassword");
	});

	it("New password input works correctly", () => {
		render(
			<BrowserRouter>
				<ModifyPassword toggleModal={() => {}} />
			</BrowserRouter>
		);

		// Get the password input
		const passwordInput = screen.getByTestId("new-password");
		// Enter a value into the password input
		fireEvent.change(passwordInput, { target: { value: "testpassword" } });
		// Check if the input value is updated
		expect(passwordInput).toHaveValue("testpassword");
	});

	it("Confirm password input works correctly", () => {
		render(
			<BrowserRouter>
				<ModifyPassword toggleModal={() => {}} />
			</BrowserRouter>
		);

		// Get the password input
		const passwordInput = screen.getByTestId("confirm-password");
		// Enter a value into the password input
		fireEvent.change(passwordInput, { target: { value: "testpassword" } });
		// Check if the input value is updated
		expect(passwordInput).toHaveValue("testpassword");
	});

	it("Show actual password when click on the eye icon", () => {
		render(
			<BrowserRouter>
				<ModifyPassword toggleModal={() => {}} />
			</BrowserRouter>
		);

		// Eye icon
		const eyeIcon = screen.getByTestId("eye-icon-1");
		expect(eyeIcon).toBeInTheDocument();

		// Password input field
		const passwordInput = screen.getByTestId("actual-password");
		expect(passwordInput).toBeInTheDocument();
		expect(passwordInput).toHaveAttribute("type", "password");

		// Test show password
		fireEvent.click(eyeIcon);
		expect(passwordInput).toHaveAttribute("type", "text");

		// Test hide password
		fireEvent.click(eyeIcon);
		expect(passwordInput).toHaveAttribute("type", "password");
	});

	it("Show new password when click on the eye icon", () => {
		render(
			<BrowserRouter>
				<ModifyPassword toggleModal={() => {}} />
			</BrowserRouter>
		);

		// Eye icon
		const eyeIcon = screen.getByTestId("eye-icon-2");
		expect(eyeIcon).toBeInTheDocument();

		// Password input field
		const passwordInput = screen.getByTestId("new-password");
		expect(passwordInput).toBeInTheDocument();
		expect(passwordInput).toHaveAttribute("type", "password");

		// Test show password
		fireEvent.click(eyeIcon);
		expect(passwordInput).toHaveAttribute("type", "text");

		// Test hide password
		fireEvent.click(eyeIcon);
		expect(passwordInput).toHaveAttribute("type", "password");
	});

	it("Show confirm password when click on the eye icon", () => {
		render(
			<BrowserRouter>
				<ModifyPassword toggleModal={() => {}} />
			</BrowserRouter>
		);

		// Eye icon
		const eyeIcon = screen.getByTestId("eye-icon-3");
		expect(eyeIcon).toBeInTheDocument();

		// Password input field
		const passwordInput = screen.getByTestId("confirm-password");
		expect(passwordInput).toBeInTheDocument();
		expect(passwordInput).toHaveAttribute("type", "password");

		// Test show password
		fireEvent.click(eyeIcon);
		expect(passwordInput).toHaveAttribute("type", "text");

		// Test hide password
		fireEvent.click(eyeIcon);
		expect(passwordInput).toHaveAttribute("type", "password");
	});

	it("submits form correctly on valid input", async () => {
		const mockedUpdateUser = updateUser as jest.Mock;
		const mockUserData = { token: "newToken", mail: "user@example.com" };
		mockedUpdateUser.mockResolvedValue(mockUserData); // Mock a successful update

		const mockedIsFormCorrect = isFormCorrect as jest.Mock;
		mockedIsFormCorrect.mockReturnValue({ isCorrect: true, errorMessage: "" });

		const mockedCreateToken = createToken as jest.Mock;

		const toastErrorMock = toast.error as jest.Mock;
		toastErrorMock.mockReturnValue(""); // Mocking the toast.error function

		render(
			<BrowserRouter>
				<ModifyPassword toggleModal={() => {}} />
			</BrowserRouter>
		);

		// Set input values
		const actualPasswordInput = screen.getByTestId("actual-password");
		fireEvent.change(actualPasswordInput, { target: { value: "actualpassword" } });

		const newPasswordInput = screen.getByTestId("new-password");
		fireEvent.change(newPasswordInput, { target: { value: "newpassword" } });

		const confirmNewPasswordInput = screen.getByTestId("confirm-password");
		fireEvent.change(confirmNewPasswordInput, { target: { value: "newpassword" } });

		// Submit the form
		const submitButton = screen.getByText("Modifier le mot de passe");
		fireEvent.click(submitButton);

		await waitFor(() => {
			// Check if updateUser function is called with the correct parameters
			expect(updateUser).toHaveBeenCalledWith("actualpassword", "newpassword");
		});
		await waitFor(() => {
			// Check if createToken function is called with the correct parameters
			expect(mockedCreateToken).toHaveBeenCalledWith(
				"newToken",
				"user@example.com",
				false
			);
		});
		await waitFor(() => {
			// Check if toast.error is not called (indicating success)
			expect(toast.error).not.toHaveBeenCalled();
		});
	});

	it("Form submission with toast error", async () => {
		const mockedUpdateUser = updateUser as jest.Mock;
		mockedUpdateUser.mockRejectedValue(new Error("Update failed")); // Mock a failed deletion

		const mockedIsFormCorrect = isFormCorrect as jest.Mock;
		mockedIsFormCorrect.mockReturnValue({ isCorrect: true, errorMessage: "" });

		render(
			<BrowserRouter>
				<ModifyPassword toggleModal={() => {}} />
			</BrowserRouter>
		);

		// Set input values
		const actualPasswordInput = screen.getByTestId("actual-password");
		fireEvent.change(actualPasswordInput, { target: { value: "actualpassword" } });

		const newPasswordInput = screen.getByTestId("new-password");
		fireEvent.change(newPasswordInput, { target: { value: "newpassword" } });

		const confirmNewPasswordInput = screen.getByTestId("confirm-password");
		fireEvent.change(confirmNewPasswordInput, { target: { value: "newpassword" } });

		// Trigger the form submission
		const submitButton = screen.getByText("Modifier le mot de passe");
		fireEvent.click(submitButton);

		await waitFor(() => {
			// Check if toast.error is called with the correct error message
			expect(toast.error).toHaveBeenCalledWith("Le mot de passe n'a pas été modifié");
		});
	});

	it("Form submission can't submit updates the error message", async () => {
		const mockedUpdateUser = updateUser as jest.Mock;
		mockedUpdateUser.mockRejectedValue(new Error("Update failed")); // Mock a failed deletion

		const mockedIsFormCorrect = isFormCorrect as jest.Mock;
		mockedIsFormCorrect.mockReturnValue({
			isCorrect: false,
			errorMessage: "Message d'erreur test",
		});

		render(
			<BrowserRouter>
				<ModifyPassword toggleModal={() => {}} />
			</BrowserRouter>
		);

		// Set input values
		const actualPasswordInput = screen.getByTestId("actual-password");
		fireEvent.change(actualPasswordInput, { target: { value: "actualpassword" } });

		const newPasswordInput = screen.getByTestId("new-password");
		fireEvent.change(newPasswordInput, { target: { value: "newpassword" } });

		const confirmNewPasswordInput = screen.getByTestId("confirm-password");
		fireEvent.change(confirmNewPasswordInput, { target: { value: "newpassword" } });

		// Trigger the form submission
		const submitButton = screen.getByText("Modifier le mot de passe");
		fireEvent.click(submitButton);

		const errorMessageElement = screen.getByTestId("error-message");
		const errorMessageContent = errorMessageElement.textContent; // Get the content of the error message element

		expect(errorMessageContent).toBe("Message d'erreur test");
	});

	it("calls toggleModal when click on Button Annuler", () => {
		render(
			<BrowserRouter>
				<ModifyPassword toggleModal={toggleModal} />
			</BrowserRouter>
		);
		const cancelButton = screen.getByText("Annuler");
		expect(cancelButton).toBeInTheDocument();
		fireEvent.click(cancelButton);
		expect(toggleModal).toHaveBeenCalledTimes(1);
	});
});

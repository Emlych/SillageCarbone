import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import Login from "../Modal/Login";
import { loginUser } from "../../services/userService";

jest.mock("../../services/userService", () => ({
	loginUser: jest.fn(),
}));

describe("Login", () => {
	const mockSetUser = jest.fn();
	const mockToggleModal = jest.fn();
	const mockSetMail = jest.fn();
	const mockSetPassword = jest.fn();
	const mockSetHiddenPassword = jest.fn();
	const mockSetErrorMessage = jest.fn();
	const mockSetComponentKeyName = jest.fn();

	const defaultProps = {
		setUser: mockSetUser,
		toggleModal: mockToggleModal,
		mail: "",
		setMail: mockSetMail,
		password: "",
		setPassword: mockSetPassword,
		hiddenPassword: false,
		setHiddenPassword: mockSetHiddenPassword,
		errorMessage: "",
		setErrorMessage: mockSetErrorMessage,
		setComponentKeyName: mockSetComponentKeyName,
	};

	it("Should update mail input value", () => {
		render(<Login {...defaultProps} />);
		const mailInput = screen.getByTestId("mail");
		const mockMailValue = "test@example.com";
		fireEvent.change(mailInput, { target: { value: mockMailValue } });
		expect(mockSetMail).toHaveBeenCalledWith(mockMailValue);
	});

	it("Should update password input value", () => {
		render(<Login {...defaultProps} />);
		const passwordInput = screen.getByTestId("password");
		const mockPasswordValue = "password123";
		fireEvent.change(passwordInput, { target: { value: mockPasswordValue } });
		expect(mockSetPassword).toHaveBeenCalledWith(mockPasswordValue);
	});

	it("Should toggle hiddenPassword state when eye icon is clicked", () => {
		render(<Login {...defaultProps} />);
		const eyeIcon = screen.getByTestId("eye-icon");
		fireEvent.click(eyeIcon);
		expect(mockSetHiddenPassword).toHaveBeenCalledTimes(1);
		expect(mockSetHiddenPassword).toHaveBeenCalledWith(true);
	});

	it('Should set component key name to "forgotten-password" when "Mot de passe oublié ?" is clicked', () => {
		render(<Login {...defaultProps} />);
		const forgotPasswordLink = screen.getByText("Mot de passe oublié ?");
		fireEvent.click(forgotPasswordLink);
		expect(mockSetComponentKeyName).toHaveBeenCalledTimes(1);
		expect(mockSetComponentKeyName).toHaveBeenCalledWith("forgotten-password");
	});

	it('Should set component key name to "signup" when "Pas de compte? Créer un compte." is clicked', () => {
		render(<Login {...defaultProps} />);
		const createAccountLink = screen.getByText("Pas de compte? Créer un compte.");
		fireEvent.click(createAccountLink);
		expect(mockSetComponentKeyName).toHaveBeenCalledTimes(1);
		expect(mockSetComponentKeyName).toHaveBeenCalledWith("signup");
	});

	it("Handles form submission successfully", async () => {
		// Mock the loginUser function to return a successful response
		(loginUser as jest.Mock).mockResolvedValue({
			token: "dummyToken",
			userType: "admin",
		});

		// Mock the toggleModal function
		const mockToggleModal = jest.fn();

		render(
			<Login
				toggleModal={mockToggleModal}
				mail=""
				setMail={() => {}}
				password=""
				setPassword={() => {}}
				hiddenPassword={false}
				setHiddenPassword={() => {}}
				setComponentKeyName={() => {}}
			/>
		);

		const mailInput = screen.getByTestId("mail");
		const passwordInput = screen.getByTestId("password");
		const form = screen.getByTestId("login-form");

		fireEvent.change(mailInput, { target: { value: "test@example.com" } });
		fireEvent.change(passwordInput, { target: { value: "password123" } });
		fireEvent.submit(form);

		expect(loginUser).toHaveBeenCalledWith("test@example.com", "password123");
		expect(mockToggleModal).toHaveBeenCalledTimes(1);
	});

	// it("Handles form submission with incorrect credentials", async () => {
	// 	// Mock the loginUser function to throw an error (simulate incorrect credentials)
	// 	(loginUser as jest.Mock).mockRejectedValue(new Error("Invalid credentials"));

	// 	// Mock the setErrorMessage function
	// 	const mockSetErrorMessage = jest.fn();
	// 	render(
	// 		<Login
	// 			toggleModal={() => {}}
	// 			mail=""
	// 			setMail={() => {}}
	// 			password=""
	// 			setPassword={() => {}}
	// 			hiddenPassword={false}
	// 			setHiddenPassword={() => {}}
	// 			setComponentKeyName={() => {}}
	// 		/>
	// 	);

	// 	const mailInput = screen.getByTestId("mail");
	// 	const passwordInput = screen.getByTestId("password");
	// 	const form = screen.getByTestId("login-form");

	// 	fireEvent.change(mailInput, { target: { value: "test@example.com" } });
	// 	fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
	// 	fireEvent.submit(form);

	// 	await waitFor(() => {
	// 		expect(loginUser).toHaveBeenCalledWith("test@example.com", "wrongpassword");
	// 		expect(mockSetErrorMessage).toHaveBeenCalledWith(
	// 			"Email ou mot de passe incorrect(s)."
	// 		);
	// 	});
	// });
});

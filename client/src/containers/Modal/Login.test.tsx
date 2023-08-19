import { render, fireEvent, screen } from "@testing-library/react";
import Login from "./Login";

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

	// it("Should call handleFormSubmit when form is submitted", () => {
	// 	// Mock the fetchUserData function to return a dummy user object
	// 	mockFetchUserData.mockResolvedValue({ token: "dummyToken", userType: "admin" });

	// 	render(<Login {...defaultProps} />);
	// 	const form = screen.getByTestId("login-form");

	// 	fireEvent.submit(form);

	// 	expect(mockFetchUserData).toHaveBeenCalledTimes(1);
	// 	expect(mockSetUser).toHaveBeenCalledTimes(1);
	// 	expect(mockToggleModal).toHaveBeenCalledTimes(1);
	// });

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
});

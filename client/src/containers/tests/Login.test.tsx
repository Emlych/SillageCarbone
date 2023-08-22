import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import Login from "../Modal/Login";
import { loginUser } from "../../services/userService";
import { createToken } from "../../utils/token-utils";
import { UserType } from "../../dto/UserDto";

jest.mock("../../services/userService", () => ({
	loginUser: jest.fn(),
}));
jest.mock("../../utils/token-utils", () => ({
	createToken: jest.fn(),
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
		hiddenPassword: true,
		setHiddenPassword: mockSetHiddenPassword,
		errorMessage: "",
		setErrorMessage: mockSetErrorMessage,
		setComponentKeyName: mockSetComponentKeyName,
	};

	it("Update mail input value", () => {
		render(<Login {...defaultProps} />);
		const mailInput = screen.getByTestId("mail");
		const mockMailValue = "test@example.com";
		fireEvent.change(mailInput, { target: { value: mockMailValue } });
		expect(mockSetMail).toHaveBeenCalledWith(mockMailValue);
	});

	it("Update password input value", () => {
		render(<Login {...defaultProps} />);
		const passwordInput = screen.getByTestId("password");
		const mockPasswordValue = "password123";
		fireEvent.change(passwordInput, { target: { value: mockPasswordValue } });
		expect(mockSetPassword).toHaveBeenCalledWith(mockPasswordValue);
	});

	it("Toggle hiddenPassword state when eye icon is clicked", () => {
		render(<Login {...defaultProps} />);

		// Find the eye icon element
		const eyeIcon = screen.getByTestId("eye-icon");

		// Verify that the initial state is true
		const passwordInput = screen.getByTestId("password") as HTMLInputElement;
		expect(passwordInput.type).toBe("password");

		// Simulate a click event on the eye icon
		fireEvent.click(eyeIcon);

		// Verify that the state has been updated to false
		expect(mockSetHiddenPassword).toHaveBeenCalledWith(false);
	});

	it('Set component key name to "forgotten-password" when "Mot de passe oublié ?" is clicked', () => {
		render(<Login {...defaultProps} />);
		const forgotPasswordLink = screen.getByText("Mot de passe oublié ?");
		fireEvent.click(forgotPasswordLink);
		expect(mockSetComponentKeyName).toHaveBeenCalledTimes(1);
		expect(mockSetComponentKeyName).toHaveBeenCalledWith("forgotten-password");
	});

	it('Set component key name to "signup" when "Pas de compte? Créer un compte." is clicked', () => {
		render(<Login {...defaultProps} />);
		const createAccountLink = screen.getByText("Pas de compte? Créer un compte.");
		fireEvent.click(createAccountLink);
		expect(mockSetComponentKeyName).toHaveBeenCalledTimes(1);
		expect(mockSetComponentKeyName).toHaveBeenCalledWith("signup");
	});

	it("Form submission with invalid mail should set error message", async () => {
		render(
			<Login
				toggleModal={jest.fn()}
				mail="nomailformat"
				setMail={() => {}}
				password="randomPassword"
				setPassword={() => {}}
				hiddenPassword={false}
				setHiddenPassword={() => {}}
				setComponentKeyName={() => {}}
			/>
		);

		const form = screen.getByTestId("login-form");
		fireEvent.submit(form);

		const errorMessage = screen.getByTestId("error-message");
		const expectedMessage = "Veuillez fournir une adresse mail valide.";
		expect(errorMessage.textContent).toBe(expectedMessage);
	});

	it("Valid form submission should call createToken", async () => {
		const mockedLoginUser = loginUser as jest.Mock;
		const mockUserData = {
			token: "newToken",
			mail: "user@example.com",
			userType: UserType.ConnectedUser,
		};
		mockedLoginUser.mockResolvedValue(mockUserData); // Mock a successful login

		const mockedCreateToken = createToken as jest.Mock;

		render(
			<Login
				toggleModal={jest.fn()}
				mail="mock@mail.com"
				setMail={() => {}}
				password="randomPassword"
				setPassword={() => {}}
				hiddenPassword={false}
				setHiddenPassword={() => {}}
				setComponentKeyName={() => {}}
			/>
		);

		const form = screen.getByTestId("login-form");
		fireEvent.submit(form);

		await waitFor(() => {
			expect(mockedCreateToken).toHaveBeenCalledWith(
				mockUserData.token,
				mockUserData.mail,
				false
			);
		});
	});

	it("Form submission with no password should set error message", async () => {
		render(
			<Login
				toggleModal={jest.fn()}
				mail="mock@mail.com"
				setMail={() => {}}
				password=""
				setPassword={() => {}}
				hiddenPassword={false}
				setHiddenPassword={() => {}}
				setComponentKeyName={() => {}}
			/>
		);

		const form = screen.getByTestId("login-form");
		fireEvent.submit(form);

		const errorMessage = screen.getByTestId("error-message");
		const expectedMessage = "Veuillez fournir un mot de passe.";
		expect(errorMessage.textContent).toBe(expectedMessage);
	});

	it("Invalid login user should set error message", async () => {
		const mockedLoginUser = loginUser as jest.Mock;
		mockedLoginUser.mockRejectedValue(new Error("Login failed")); // Mock an unsuccessful login

		render(
			<Login
				toggleModal={jest.fn()}
				mail="mock@mail.com"
				setMail={() => {}}
				password="randomPassword"
				setPassword={() => {}}
				hiddenPassword={false}
				setHiddenPassword={() => {}}
				setComponentKeyName={() => {}}
			/>
		);

		const form = screen.getByTestId("login-form");
		fireEvent.submit(form);

		await waitFor(() => {
			const errorMessage = screen.getByTestId("error-message");
			const expectedMessage = "Email ou mot de passe incorrect(s).";
			expect(errorMessage.textContent).toBe(expectedMessage);
		});
	});
});

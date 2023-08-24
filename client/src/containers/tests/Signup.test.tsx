import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import Signup from "../Modal/Signup";
import { createToken } from "../../utils/token-utils";
import { createUser } from "../../services/userService";

jest.mock("../../utils/token-utils", () => ({
	createToken: jest.fn(),
}));
jest.mock("../../services/userService", () => ({
	createUser: jest.fn(),
}));

describe("Signup", () => {
	const mockSetUser = jest.fn();
	const mockToggleModal = jest.fn();
	const mockSetMail = jest.fn();
	const mockSetPassword = jest.fn();
	const mockSetConfirmPassword = jest.fn();
	const mockSetHiddenPassword = jest.fn();
	const mockSetHiddenConfirmPassword = jest.fn();
	const mockSetComponentKeyName = jest.fn();

	const defaultProps = {
		setUser: mockSetUser,
		toggleModal: mockToggleModal,
		mail: "",
		setMail: mockSetMail,
		password: "",
		setPassword: mockSetPassword,
		confirmPassword: "",
		setConfirmPassword: mockSetConfirmPassword,
		hiddenPassword: false,
		setHiddenPassword: mockSetHiddenPassword,
		hiddenConfirmPassword: false,
		setHiddenConfirmPassword: mockSetHiddenConfirmPassword,
		errorMessage: "",
		setComponentKeyName: mockSetComponentKeyName,
	};

	it("renders correctly signup modal", () => {
		render(<Signup {...defaultProps} />);
		const title = screen.getByText("Création d'un compte");
		expect(title).toBeInTheDocument();
	});

	it("Update mail input value", () => {
		render(<Signup {...defaultProps} />);
		const mailInput = screen.getByTestId("mail");
		const mockMailValue = "test@example.com";
		fireEvent.change(mailInput, { target: { value: mockMailValue } });
		expect(mockSetMail).toHaveBeenCalledWith(mockMailValue);
	});

	it("Update password input value", () => {
		render(<Signup {...defaultProps} />);
		const passwordInput = screen.getAllByTestId("password")[0];
		const mockPasswordValue = "password123";
		fireEvent.change(passwordInput, { target: { value: mockPasswordValue } });
		expect(mockSetPassword).toHaveBeenCalledWith(mockPasswordValue);
	});

	it("should update confirm password input value", () => {
		render(<Signup {...defaultProps} />);
		const confirmPasswordInput = screen.getAllByTestId("password")[1];
		const mockConfirmPasswordValue = "password123";
		fireEvent.change(confirmPasswordInput, {
			target: { value: mockConfirmPasswordValue },
		});
		expect(mockSetConfirmPassword).toHaveBeenCalledWith(mockConfirmPasswordValue);
	});

	it("Toggle hiddenPassword state when password eye icon is clicked", () => {
		render(<Signup {...defaultProps} />);
		const passwordEyeIcon = screen.getAllByTestId("eye-icon")[0];
		fireEvent.click(passwordEyeIcon);
		expect(mockSetHiddenPassword).toHaveBeenCalledTimes(1);
		expect(mockSetHiddenPassword).toHaveBeenCalledWith(true);
	});

	it("Toggle hiddenConfirmPassword state when confirm password eye icon is clicked", () => {
		render(<Signup {...defaultProps} />);
		const confirmPasswordEyeIcon = screen.getAllByTestId("eye-icon")[1];
		fireEvent.click(confirmPasswordEyeIcon);
		expect(mockSetHiddenConfirmPassword).toHaveBeenCalledTimes(1);
		expect(mockSetHiddenConfirmPassword).toHaveBeenCalledWith(true);
	});

	it('Set component key name to "login" when "Si vous avez déjà un compte, se connecter." is clicked', () => {
		render(<Signup {...defaultProps} />);
		const loginLink = screen.getByText("Si vous avez déjà un compte, se connecter.");
		fireEvent.click(loginLink);
		expect(mockSetComponentKeyName).toHaveBeenCalledTimes(1);
		expect(mockSetComponentKeyName).toHaveBeenCalledWith("login");
	});

	it("Form submission with invalid mail should set error message", async () => {
		render(
			<Signup
				toggleModal={jest.fn()}
				//setUser={mockSetUser}
				mail="invalid mail"
				setMail={mockSetMail}
				password="LongPassword1"
				setPassword={mockSetPassword}
				confirmPassword="LongPassword1"
				setConfirmPassword={mockSetConfirmPassword}
				hiddenPassword={false}
				setHiddenPassword={mockSetHiddenPassword}
				hiddenConfirmPassword={false}
				setHiddenConfirmPassword={mockSetHiddenConfirmPassword}
				setComponentKeyName={mockSetComponentKeyName}
			/>
		);

		const form = screen.getByTestId("signup-form");
		fireEvent.submit(form);

		const errorMessage = screen.getByTestId("error-message");
		const expectedMessage = "Veuillez fournir une adresse mail valide.";
		expect(errorMessage.textContent).toBe(expectedMessage);
	});

	it("Valid form submission should call createToken", async () => {
		const mockedCreateUser = createUser as jest.Mock;
		const mockUserData = {
			token: "newToken",
			mail: "user@example.com",
		};
		mockedCreateUser.mockResolvedValue(mockUserData); // Mock a successful creation

		const mockedCreateToken = createToken as jest.Mock;

		render(
			<Signup
				toggleModal={jest.fn()}
				mail="validMail@mail.com"
				setMail={mockSetMail}
				password="LongPassword1"
				setPassword={mockSetPassword}
				confirmPassword="LongPassword1"
				setConfirmPassword={mockSetConfirmPassword}
				hiddenPassword={false}
				setHiddenPassword={mockSetHiddenPassword}
				hiddenConfirmPassword={false}
				setHiddenConfirmPassword={mockSetHiddenConfirmPassword}
				setComponentKeyName={mockSetComponentKeyName}
			/>
		);

		const form = screen.getByTestId("signup-form");
		fireEvent.submit(form);

		await waitFor(() => {
			expect(mockedCreateToken).toHaveBeenCalledWith(
				mockUserData.token,
				mockUserData.mail,
				false
			);
		});
	});

	it("Invalid user creation should set error message", async () => {
		const mockedCreateUser = createUser as jest.Mock;
		mockedCreateUser.mockRejectedValue(new Error("User could not be created")); // Mock an unsuccessful creation

		render(
			<Signup
				toggleModal={jest.fn()}
				mail="validMail@mail.com"
				setMail={mockSetMail}
				password="LongPassword1"
				setPassword={mockSetPassword}
				confirmPassword="LongPassword1"
				setConfirmPassword={mockSetConfirmPassword}
				hiddenPassword={false}
				setHiddenPassword={mockSetHiddenPassword}
				hiddenConfirmPassword={false}
				setHiddenConfirmPassword={mockSetHiddenConfirmPassword}
				setComponentKeyName={mockSetComponentKeyName}
			/>
		);

		const form = screen.getByTestId("signup-form");
		fireEvent.submit(form);

		await waitFor(() => {
			const errorMessage = screen.getByTestId("error-message");
			const expectedMessage = "Erreur dans la création du compte.";
			expect(errorMessage.textContent).toBe(expectedMessage);
		});
	});

	it("Invalid user creation, because of existing user, should set error message", async () => {
		const mockedCreateUser = createUser as jest.Mock;
		const mockErrorResponse = {
			response: {
				data: {
					message: "User already exists",
				},
			},
		};
		mockedCreateUser.mockRejectedValue(mockErrorResponse);

		render(
			<Signup
				toggleModal={jest.fn()}
				mail="validMail@mail.com"
				setMail={mockSetMail}
				password="LongPassword1"
				setPassword={mockSetPassword}
				confirmPassword="LongPassword1"
				setConfirmPassword={mockSetConfirmPassword}
				hiddenPassword={false}
				setHiddenPassword={mockSetHiddenPassword}
				hiddenConfirmPassword={false}
				setHiddenConfirmPassword={mockSetHiddenConfirmPassword}
				setComponentKeyName={mockSetComponentKeyName}
			/>
		);

		const form = screen.getByTestId("signup-form");
		fireEvent.submit(form);

		await waitFor(() => {
			const errorMessage = screen.getByTestId("error-message");
			const expectedMessage = "Ce compte existe déjà.";
			expect(errorMessage.textContent).toBe(expectedMessage);
		});
	});

	it("toggles eye icon between faEye and faEyeSlash", () => {
		const mockTogglePassword = jest.fn();
		render(
			<Signup
				toggleModal={jest.fn()}
				mail="validMail@mail.com"
				setMail={mockSetMail}
				password="LongPassword1"
				setPassword={mockSetPassword}
				confirmPassword="LongPassword1"
				setConfirmPassword={mockSetConfirmPassword}
				hiddenPassword={false}
				setHiddenPassword={mockTogglePassword}
				hiddenConfirmPassword={false}
				setHiddenConfirmPassword={mockSetHiddenConfirmPassword}
				setComponentKeyName={mockSetComponentKeyName}
			/>
		);

		const eyeIcon = screen.getAllByTestId("eye-icon")[0];

		// Initial state: hiddenPassword is true, should display faEyeSlash icon
		expect(eyeIcon).toHaveAttribute("data-icon", "eye-slash");

		// Simulate click event
		fireEvent.click(eyeIcon);

		// Confirm that setHiddenPassword was called with the updated value
		expect(mockTogglePassword).toHaveBeenCalledWith(true);
	});
});

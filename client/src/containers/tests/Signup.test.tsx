import { render, fireEvent, screen } from "@testing-library/react";
import Signup from "../Modal/Signup";

describe("Signup", () => {
	const mockSetUser = jest.fn();
	const mockToggleModal = jest.fn();
	//const mockHandleFormSubmit = jest.fn();
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

	test("should update mail input value", () => {
		render(<Signup {...defaultProps} />);
		const mailInput = screen.getByTestId("mail");
		const mockMailValue = "test@example.com";
		fireEvent.change(mailInput, { target: { value: mockMailValue } });
		expect(mockSetMail).toHaveBeenCalledWith(mockMailValue);
	});

	test("should update password input value", () => {
		render(<Signup {...defaultProps} />);
		const passwordInput = screen.getAllByTestId("password")[0];
		const mockPasswordValue = "password123";
		fireEvent.change(passwordInput, { target: { value: mockPasswordValue } });
		expect(mockSetPassword).toHaveBeenCalledWith(mockPasswordValue);
	});

	test("should update confirm password input value", () => {
		render(<Signup {...defaultProps} />);
		const confirmPasswordInput = screen.getAllByTestId("password")[1];
		const mockConfirmPasswordValue = "password123";
		fireEvent.change(confirmPasswordInput, {
			target: { value: mockConfirmPasswordValue },
		});
		expect(mockSetConfirmPassword).toHaveBeenCalledWith(mockConfirmPasswordValue);
	});

	test("should toggle hiddenPassword state when password eye icon is clicked", () => {
		render(<Signup {...defaultProps} />);
		const passwordEyeIcon = screen.getAllByTestId("eye-icon")[0];
		fireEvent.click(passwordEyeIcon);
		expect(mockSetHiddenPassword).toHaveBeenCalledTimes(1);
		expect(mockSetHiddenPassword).toHaveBeenCalledWith(true);
	});

	test("should toggle hiddenConfirmPassword state when confirm password eye icon is clicked", () => {
		render(<Signup {...defaultProps} />);
		const confirmPasswordEyeIcon = screen.getAllByTestId("eye-icon")[1];
		fireEvent.click(confirmPasswordEyeIcon);
		expect(mockSetHiddenConfirmPassword).toHaveBeenCalledTimes(1);
		expect(mockSetHiddenConfirmPassword).toHaveBeenCalledWith(true);
	});

	// test.skip("should call handleFormSubmit when form is submitted", () => {
	// 	render(<Signup {...defaultProps} />);
	// 	const form = screen.getByTestId("signup-form");
	// 	fireEvent.submit(form);
	// 	expect(mockHandleFormSubmit).toHaveBeenCalledTimes(1);
	// });

	test('should set component key name to "login" when "Si vous avez déjà un compte, se connecter." is clicked', () => {
		render(<Signup {...defaultProps} />);
		const loginLink = screen.getByText("Si vous avez déjà un compte, se connecter.");
		fireEvent.click(loginLink);
		expect(mockSetComponentKeyName).toHaveBeenCalledTimes(1);
		expect(mockSetComponentKeyName).toHaveBeenCalledWith("login");
	});
});

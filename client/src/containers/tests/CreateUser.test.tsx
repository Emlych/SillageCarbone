import { render, fireEvent, screen } from "@testing-library/react";
import CreateUser from "../BackOffice/CreateUser";
import React from "react";

describe("CreateUser", () => {
	test("should update mail input value", () => {
		// Mock useState to track setMail function
		const setState = jest.fn();
		const useStateMock: any = (initialState: any) => [initialState, setState];
		jest.spyOn(React, "useState").mockImplementation(useStateMock);

		render(<CreateUser />);

		const mailInput = screen.getByTestId("mail");
		const mockMailValue = "test@example.com";
		fireEvent.change(mailInput, { target: { value: mockMailValue } });

		// Verify that setMail has been called with the correct value
		expect(setState).toHaveBeenCalledWith(mockMailValue);

		// Clean up the mock
		jest.restoreAllMocks();
	});

	test("should update password input value", () => {
		const setState = jest.fn();
		const useStateMock: any = (initialState: any) => [initialState, setState];
		jest.spyOn(React, "useState").mockImplementation(useStateMock);

		render(<CreateUser />);

		const passwordInput = screen.getByTestId("password");
		const mockPasswordValue = "azerty123";
		fireEvent.change(passwordInput, { target: { value: mockPasswordValue } });

		// Verify that setMail has been called with the correct value
		expect(setState).toHaveBeenCalledWith(mockPasswordValue);

		// Clean up the mock
		jest.restoreAllMocks();
	});

	test("should toggle hiddenPassword state when password eye icon is clicked", () => {
		render(<CreateUser />);

		// Find the eye icon element
		const eyeIcon = screen.getByTestId("eye-icon");

		// Verify that the initial state is true
		const passwordInput = screen.getByTestId("password") as HTMLInputElement;
		expect(passwordInput.type).toBe("password");

		// Simulate a click event on the eye icon
		fireEvent.click(eyeIcon);

		// Verify that the state has been updated to false
		expect(passwordInput.type).toBe("text");

		// Simulate another click event on the eye icon
		fireEvent.click(eyeIcon);

		// Verify that the state has toggled back to true
		expect(passwordInput.type).toBe("password");
	});
});

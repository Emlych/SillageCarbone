import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "../Modal";
import { MemoryRouter } from "react-router-dom";

describe("Modal", () => {
	it("renders Login component when componentKeyName is 'login'", () => {
		render(<Modal toggleModal={() => {}} />);
		const loginComponent = screen.getByTestId("login-form");
		expect(loginComponent).toBeInTheDocument();
	});

	it("renders Modify account component when componentKeyName is 'change-password'", () => {
		render(<Modal toggleModal={() => {}} accountModalKey="change-password" />);
		const modifyAccountComponent = screen.getByTestId("change-password-form"); // You need to adjust this selector based on how the Signup component is structured
		expect(modifyAccountComponent).toBeInTheDocument();
	});

	it('renders DeleteAccount component when accountModalKey is "delete-account"', () => {
		render(
			<MemoryRouter>
				<Modal toggleModal={jest.fn()} accountModalKey="delete-account" />
			</MemoryRouter>
		);
		const deleteAccountComponent = screen.getByTestId("delete-account-form");
		expect(deleteAccountComponent).toBeInTheDocument();
	});

	it('renders AdminDeleteAccount component when accountModalKey is "admin-delete-account"', () => {
		render(
			<Modal
				toggleModal={jest.fn()}
				accountModalKey="admin-delete-account"
				mailToDelete="mock@mail.com"
			/>
		);
		const adminDeleteAccountComponent = screen.getByTestId("admin-delete-account-form");
		expect(adminDeleteAccountComponent).toBeInTheDocument();
	});

	it('renders ProductDetail component when accountModalKey is "product-detail"', () => {
		render(
			<Modal
				toggleModal={jest.fn()}
				accountModalKey="product-detail"
				productId="productId1"
			/>
		);
		const productDetailComponent = screen.getByTestId("product-detail");
		expect(productDetailComponent).toBeInTheDocument();
	});

	it("calls toggleModal when clicking outside the modal content", () => {
		const toggleModalMock = jest.fn();
		render(<Modal toggleModal={toggleModalMock} />);
		const modalBackdrop = screen.getByTestId("modal-backdrop");
		expect(modalBackdrop).toBeInTheDocument(); // Whole modal
		fireEvent.click(modalBackdrop); // Simulate a click event on the modal backdrop
		expect(toggleModalMock).toHaveBeenCalled();
	});

	it("Call toggleModal when close button is clicked", () => {
		const mockToggleModal = jest.fn();
		render(<Modal toggleModal={mockToggleModal} />);

		const closeButton = screen.getByText("×");
		fireEvent.click(closeButton);

		expect(mockToggleModal).toHaveBeenCalled();
	});
});

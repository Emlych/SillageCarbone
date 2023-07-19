import { render, fireEvent, screen } from "@testing-library/react";
import Account from "../Account.page";
import { MemoryRouter } from "react-router-dom";

describe("Account page", () => {
	// Miss test of cookies

	test("opens change password modal on button click", () => {
		render(<Account />);
		const changePasswordButton = screen.getByText("Changement du mot de passe");
		fireEvent.click(changePasswordButton);
		const changePasswordModal = screen.getByTestId("change-password-form");
		expect(changePasswordModal).toBeInTheDocument();
	});

	test("opens delete modal on button click", () => {
		render(
			<MemoryRouter>
				<Account />
			</MemoryRouter>
		);
		const deleteAccountButton = screen.getByText("Supprimer");
		fireEvent.click(deleteAccountButton);
		const deleteAccountModal = screen.getByTestId("change-password-form");
		expect(deleteAccountModal).toBeInTheDocument();
	});
});

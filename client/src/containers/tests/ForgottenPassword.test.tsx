import { render, fireEvent, screen } from "@testing-library/react";
import ForgottenPassword from "../Modal/ForgottenPassword";

describe("ForgottenPassword Component", () => {
	it("Renders the component without error", () => {
		render(<ForgottenPassword mail="" setMail={() => {}} />);

		const h2 = screen.getByText("Mot de passe oublié");
		expect(h2).toBeInTheDocument();

		const submitFormButton = screen.getByText("Soumettre");
		expect(submitFormButton).toBeInTheDocument();
	});

	it("Updates email input value", () => {
		const setMailMock = jest.fn();
		render(<ForgottenPassword mail="" setMail={setMailMock} />);

		const emailInput = screen.getByTestId("mail");
		fireEvent.change(emailInput, { target: { value: "test@example.com" } });

		expect(setMailMock).toHaveBeenCalledWith("test@example.com");
	});
});

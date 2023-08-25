import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ErrorProduct from "../ErrorProduct";
import { ReactNode } from "react";

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	useNavigate: () => mockNavigate,
	Link: ({ to, children }: { to: string; children: ReactNode }) => (
		<a href={to} data-testid="mock-link">
			{children}
		</a>
	),
}));

it("ProductCard renders correctly", () => {
	render(<ErrorProduct />);

	// Check if error 404 is rendered
	const title = screen.getByText("404");
	expect(title).toBeInTheDocument();

	const h2 = "Erreur de navigation.";
	const divText1 = "Vous semblez vous être perdu!";
	const divText2 = "Nous vous suggérons de retourner à votre port base.";

	const h2Text = screen.getByText(h2);
	expect(h2Text).toBeInTheDocument();
	const text1 = screen.getByText(divText1);
	expect(text1).toBeInTheDocument();
	const text2 = screen.getByText(divText2);
	expect(text2).toBeInTheDocument();

	// Check if button is rendered
	const button = screen.getByText("Retour au port base");
	expect(button).toBeInTheDocument();
});

// it("calls the callback function when clicked", async () => {
// 	render(<ErrorProduct />);

// 	// Check if button is rendered
// 	const button = screen.getByText("Retour au port base");
// 	expect(button).toBeInTheDocument();

// 	// Simulate clicking the link
// 	fireEvent.click(screen.getByTestId("mock-link")); // Make sure the target element is correct

// 	// Wait for the component to settle
// 	await waitFor(() => {
// 		// Check if the navigation function was called
// 		expect(mockNavigate).toHaveBeenCalledTimes(1);
// 		// eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
// 		expect(mockNavigate).toHaveBeenCalledWith("/");
// 	});
// });

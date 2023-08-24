import { render, screen, fireEvent } from "@testing-library/react";
import { deleteToken } from "../../utils/token-utils";
import Header from "../Header/Header";
import { MemoryRouter } from "react-router-dom";
import Cookies from "js-cookie";

// Mock js cookie dependency
jest.mock("js-cookie");

jest.mock("../../utils/token-utils", () => ({
	deleteToken: jest.fn(),
}));

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
	// -- Import non-mocked library and use other functionalities and hooks
	...jest.requireActual("react-router-dom"),
	// -- Mock the required hook
	useNavigate: () => mockNavigate,
}));

describe("Header container", () => {
	// Test tokens
	const userToken = "user-token";

	beforeAll(() => {
		Object.defineProperty(window, "location", {
			configurable: true,
			value: { reload: jest.fn() },
		});
	});

	afterAll(() => {
		Object.defineProperty(window, "location", {
			configurable: true,
			value: window.location,
		});
	});

	it("renders the header with big screen and handles deconnexion", () => {
		(Cookies.get as jest.Mock).mockReturnValue(userToken);
		const mockedDeleteToken = deleteToken as jest.Mock;

		render(
			<MemoryRouter>
				<Header toggleModal={() => {}} />
			</MemoryRouter>
		);

		// Check if the big screen header is rendered
		const bigScreenHeader = screen.getByTestId("header-big-screen");
		expect(bigScreenHeader).toBeInTheDocument();

		// Simulate a click on the deconnexion button
		const deconnexionButton = screen.getByText("Déconnexion");
		fireEvent.click(deconnexionButton);

		// Check if the deleteToken function is called
		expect(mockedDeleteToken).toHaveBeenCalledTimes(1);

		// Check if the navigate function is called with the correct path
		expect(mockNavigate).toHaveBeenCalledWith("/");
	});
});

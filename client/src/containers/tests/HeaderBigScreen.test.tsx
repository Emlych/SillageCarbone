import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Cookies from "js-cookie";
import HeaderBigScreen from "../Header/HeaderBigScreen";
import { deleteToken } from "../../utils/token-utils";
import { ReactNode } from "react";
import { SpecificHeaderConnexionProps } from "../Header/Header";

// Mock js cookie dependency
jest.mock("js-cookie");

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
	// -- Import non-mocked library and use other functionalities and hooks
	...jest.requireActual("react-router-dom"),
	// -- Mock the required hook
	useNavigate: () => mockNavigate,
	// -- Mock Link as an anchor tag
	Link: ({ to, children }: { to: string; children: ReactNode }) => (
		<a href={to} data-testid={to}>
			{children}
		</a>
	),
}));

describe("HeaderBigScreen component", () => {
	// Mock props
	const toggleModal = jest.fn();
	const handleDeconnexion = () => {
		deleteToken();
		mockNavigate("/");
	};
	// Test tokens
	const userToken = "user-token";
	const adminToken = "admin-token";

	/** Render header big screen component */
	const setup = (props: Partial<SpecificHeaderConnexionProps> = {}) => {
		const defaultProps: SpecificHeaderConnexionProps = {
			toggleModal,
			handleDeconnexion,
		};
		const mergedProps = { ...defaultProps, ...props };
		return render(
			<MemoryRouter>
				<HeaderBigScreen {...mergedProps} />
			</MemoryRouter>
		);
	};

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
	beforeEach(() => {
		(Cookies.get as jest.Mock).mockClear();
	});

	it("renders no account, favorites and backoffice if no token present", () => {
		setup();

		const compteElement = screen.queryByText("Compte");
		expect(compteElement).toBeNull();
		const favoritesElement = screen.queryByText("Favoris");
		expect(favoritesElement).toBeNull();

		// Without token, the connexion link is there
		const connexionElement = screen.getByTestId("link-connexion");
		expect(connexionElement).toBeInTheDocument();
	});

	it("renders account and favorites links when userToken is present", () => {
		(Cookies.get as jest.Mock).mockReturnValue(userToken);
		setup();
		expect(screen.getByTestId("/account")).toBeInTheDocument();
		expect(screen.getByTestId("/favorites")).toBeInTheDocument();
	});

	it("renders backoffice link when adminToken is present", () => {
		(Cookies.get as jest.Mock).mockReturnValue(adminToken);
		setup();
		expect(screen.getByText("Backoffice")).toBeInTheDocument();
	});

	it("calls handleDeconnexion and navigate to home when déconnexion link is clicked", () => {
		(Cookies.get as jest.Mock).mockReturnValue(userToken);
		setup();
		const deconnexionLink = screen.getByTestId("link-deconnexion");
		fireEvent.click(deconnexionLink);
		expect(mockNavigate).toHaveBeenCalledTimes(1);
		expect(mockNavigate).toHaveBeenCalledWith("/");
	});

	it("calls toggleModal when connexion link is clicked", () => {
		(Cookies.get as jest.Mock).mockReturnValue(undefined);
		setup();
		const connexionLink = screen.getByTestId("link-connexion");
		fireEvent.click(connexionLink);
		expect(toggleModal).toHaveBeenCalledTimes(1);
	});

	// Navigate to home page
	it("When click on homepage Link, user will navigate to the home page", () => {
		setup();
		const href = "/";
		const link = screen.getByTestId(href);
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", href);
		fireEvent.click(link);
	});

	// Navigate to account page
	it("When click on account Link, user will navigate to the account page", () => {
		(Cookies.get as jest.Mock).mockReturnValue(userToken);
		setup();
		const href = "/account";
		const link = screen.getByTestId(href);
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", href);
		fireEvent.click(link);
	});

	// Navigate to account page
	it("When click on favorites Link, user will navigate to the favorites page", () => {
		(Cookies.get as jest.Mock).mockReturnValue(userToken);
		setup();
		const href = "/favorites";
		const link = screen.getByTestId(href);
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", href);
		fireEvent.click(link);
	});
});

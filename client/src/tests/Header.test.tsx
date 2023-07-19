import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Cookies from "js-cookie";
import HeaderBigScreen, {
	HeaderBigScreenProps,
} from "../containers/Header/HeaderBigScreen";

// Mock js cookie dependency
jest.mock("js-cookie");

// // Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	useNavigate: () => {
		return mockNavigate;
	},
}));

describe("HeaderBigScreen component", () => {
	const toggleModal = jest.fn();
	const handleDeconnexion = jest.fn();
	const userToken = "user-token";
	const adminToken = "admin-token";

	/** Render header big screen component */
	const setup = (props: Partial<HeaderBigScreenProps> = {}) => {
		const defaultProps: HeaderBigScreenProps = {
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

	test("renders no account, favorites and backoffice if no token present", () => {
		setup();

		const compteElement = screen.queryByText("Compte");
		expect(compteElement).toBeNull();
		const favoritesElement = screen.queryByText("Favoris");
		expect(favoritesElement).toBeNull();

		// Without token, the Deconnexion link is there
		const connexionElement = screen.getByTestId("link-connexion");
		expect(connexionElement).toBeInTheDocument();
	});

	test("renders account and favorites links when userToken is present", () => {
		(Cookies.get as jest.Mock).mockReturnValue(userToken);

		setup();

		expect(screen.getByTestId("account-link")).toBeInTheDocument();
		expect(screen.getByTestId("favorites-link")).toBeInTheDocument();
	});

	test("renders backoffice link when adminToken is present", () => {
		(Cookies.get as jest.Mock).mockReturnValue(adminToken);

		setup();

		expect(screen.getByText("Backoffice")).toBeInTheDocument();
	});

	test("calls handleDeconnexion and navigate to home when déconnexion link is clicked", () => {
		(Cookies.get as jest.Mock).mockReturnValue(userToken);

		setup();

		const deconnexionLink = screen.getByTestId("link-deconnexion");
		fireEvent.click(deconnexionLink);
		expect(handleDeconnexion).toHaveBeenCalledTimes(1);
		expect(mockNavigate).toHaveBeenCalledWith("/");
	});

	test("calls toggleModal when connexion link is clicked", () => {
		(Cookies.get as jest.Mock).mockReturnValue(undefined);

		setup();

		const connexionLink = screen.getByTestId("link-connexion");
		fireEvent.click(connexionLink);

		expect(toggleModal).toHaveBeenCalledTimes(1);
	});

	// // Navigate to account page
	// test("When click on account Link, user will navigate to the account page", () => {
	// 	(Cookies.get as jest.Mock).mockReturnValue(userToken);
	// 	//(useNavigate as jest.Mock).mockReturnValue(mockNavigate);

	// 	setup();

	// 	const accountLink = screen.getByTestId("account-link");
	// 	fireEvent.click(accountLink);

	// 	expect(mockNavigate).toHaveBeenCalledTimes(1);
	// 	expect(mockNavigate).toHaveBeenCalledWith("/account");

	// 	// expect(mockNavigate).toHaveBeenCalledTimes(1);
	// });
});

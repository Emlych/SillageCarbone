import { render, screen, fireEvent } from "@testing-library/react";
import HeaderSmallScreen from "../Header/HeaderSmallScreen";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { SpecificHeaderConnexionProps } from "../Header/Header";
import Cookies from "js-cookie";

// Mock the required modules
// jest.mock("react-router-dom", () => ({
// 	Link: ({ to, children }) => <a href={to}>{children}</a>,
// }))
// Mock js cookie dependency
jest.mock("js-cookie");
jest.mock("../Header/CollapseNav", () => () => <div>CollapseNav</div>);

describe("HeaderSmallScreen component", () => {
	//Token
	const userToken = "user-token";

	// Mock props
	const toggleModal = jest.fn();
	const handleDeconnexion = jest.fn();
	/** Render header small screen component */
	const setup = (props: Partial<SpecificHeaderConnexionProps> = {}) => {
		const defaultProps: SpecificHeaderConnexionProps = {
			toggleModal,
			handleDeconnexion,
		};
		const mergedProps = { ...defaultProps, ...props };
		return render(
			<MemoryRouter>
				<HeaderSmallScreen {...mergedProps} />
			</MemoryRouter>
		);
	};

	beforeEach(() => {
		(Cookies.get as jest.Mock).mockClear();
	});

	it("renders without crashing", () => {
		setup();
		const navigationElement = screen.getByRole("navigation");
		expect(navigationElement).toBeInTheDocument();
	});

	it("displays logo text", () => {
		setup();
		const logoElement = screen.getByText("SillageCarbone");
		expect(logoElement).toBeInTheDocument();
	});

	it("toggles the burger menu when menu icon is clicked", () => {
		(Cookies.get as jest.Mock).mockReturnValue(userToken);
		const toggleModalMock = jest.fn();
		const handleDeconnexionMock = jest.fn();
		render(
			<BrowserRouter>
				<HeaderSmallScreen
					toggleModal={toggleModalMock}
					handleDeconnexion={handleDeconnexionMock}
				/>
			</BrowserRouter>
		);

		const burgerIcon = screen.getByRole("button", {}); //only one button in header small screen
		//Toggle collapse nav
		fireEvent.click(burgerIcon);
		expect(screen.getByText("CollapseNav")).toBeInTheDocument();
		//Hide collapse nav
		fireEvent.click(burgerIcon);
		expect(screen.queryByText("CollapseNav")).not.toBeInTheDocument();
	});

	it('shows "Connexion" element if user is not logged in', () => {
		setup();
		const connexionElement = screen.getByText("Connexion");
		expect(connexionElement).toBeInTheDocument();
	});
});

import { render, fireEvent, screen } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import CollapseNav from "../Header/CollapseNav";
import { ReactNode } from "react";

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

describe("CollapseNav component", () => {
	it("renders correctly when user is not logged in", () => {
		(Cookies.get as jest.Mock).mockReturnValue(undefined);

		render(<CollapseNav toggleBurgerMenu={() => {}} handleDeconnexion={() => {}} />);

		expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
		expect(screen.queryByText("Compte")).not.toBeInTheDocument();
		expect(screen.queryByText("Favoris")).not.toBeInTheDocument();
		expect(screen.queryByText("Déconnexion")).not.toBeInTheDocument();
		expect(screen.queryByRole("button", { name: "Déconnexion" })).not.toBeInTheDocument();
		expect(screen.queryByText("Backoffice")).not.toBeInTheDocument();
	});

	it("renders correctly when user is logged in", () => {
		(Cookies.get as jest.Mock).mockReturnValue("userTokenValue");

		render(<CollapseNav toggleBurgerMenu={() => {}} handleDeconnexion={() => {}} />);

		expect(screen.getByRole("navigation")).toBeInTheDocument();
		expect(screen.getByText("Compte")).toBeInTheDocument();
		expect(screen.getByText("Favoris")).toBeInTheDocument();
		expect(screen.getByText("Déconnexion")).toBeInTheDocument();
	});

	it("renders Backoffice link when admin is logged in", () => {
		(Cookies.get as jest.Mock).mockReturnValue(undefined); // Simulating no userToken
		(Cookies.get as jest.Mock).mockReturnValue("adminTokenValue");

		render(<CollapseNav toggleBurgerMenu={() => {}} handleDeconnexion={() => {}} />);

		expect(screen.getByText("Backoffice")).toBeInTheDocument();
	});

	it("navigates correctly when links are clicked", () => {
		// Set up mock for userToken
		(Cookies.get as jest.Mock).mockReturnValue("userTokenValue");

		// Render the component
		render(<CollapseNav toggleBurgerMenu={() => {}} handleDeconnexion={() => {}} />);

		// Click on "Compte" link
		fireEvent.click(screen.getByText("Compte"));
		expect(mockNavigate).toHaveBeenCalledWith("/account");

		// Click on "Favoris" link
		fireEvent.click(screen.getByText("Favoris"));
		expect(mockNavigate).toHaveBeenCalledWith("/favorites");

		// Click on "Déconnexion" link
		fireEvent.click(screen.getByText("Déconnexion"));
		expect(mockNavigate).toHaveBeenCalledWith("/");

		// Make sure that navigateMock was called the expected number of times
		expect(mockNavigate).toHaveBeenCalledTimes(3);
	});
});

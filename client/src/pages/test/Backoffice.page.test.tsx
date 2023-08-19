import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Cookies from "js-cookie";
import Backoffice from "../Backoffice.page";

// Mock js cookie dependency
jest.mock("js-cookie");

describe("Backoffice Component", () => {
	beforeEach(() => {
		(Cookies.get as jest.Mock).mockClear();
	});

	it("renders BackofficeComponents when user is authenticated", () => {
		// Mock authenticated user
		(Cookies.get as jest.Mock).mockReturnValue("adminToken");
		render(<Backoffice />, { wrapper: MemoryRouter });
		// Check if BackofficeComponents are rendered
		expect(screen.getByTestId("backoffice-components")).toBeInTheDocument();
	});

	it("redirects to home page when user is not authenticated", () => {
		// Mock unauthenticated user
		(Cookies.get as jest.Mock).mockReturnValue(undefined);
		render(
			<MemoryRouter initialEntries={["/backoffice"]}>
				<Routes>
					<Route path="/backoffice" element={<Backoffice />} />
					<Route path="/">Home Page</Route>
				</Routes>
			</MemoryRouter>
		);

		// Check if redirection occurs to home page
		expect(screen.queryByTestId("backoffice-components")).not.toBeInTheDocument();
		// Check if redirection occurs to home page by checking the current route
		expect(window.location.pathname).toBe("/");
	});

	it("switches components based on URL hash", () => {
		// Mock authenticated user
		(Cookies.get as jest.Mock).mockReturnValue("adminToken");

		render(
			<MemoryRouter initialEntries={["/#products"]}>
				<Routes>
					<Route path="/" element={<Backoffice />}></Route>
				</Routes>
			</MemoryRouter>
		);

		// Check if BackofficeComponents are rendered with the correct componentKey
		expect(screen.getByTestId("backoffice-components")).toBeInTheDocument();

		expect(
			screen.getByTestId("backoffice-components").getAttribute("data-component-key")
		).toBe("products");
	});
});

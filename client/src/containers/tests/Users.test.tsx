import { render, fireEvent, screen } from "@testing-library/react";
import Users from "../BackOffice/Users";

test("Users component renders correctly", () => {
	render(<Users />);

	// Check if the page title is rendered
	const pageTitle = screen.getByText("Liste de tous les utilisateurs");
	expect(pageTitle).toBeInTheDocument();

	// Check if the filter labels are rendered
	const filterLabels = ["Nom d'utilisateur:", "Quantité par page:"];
	filterLabels.forEach((label) => {
		const filterLabel = screen.getByText(label);
		expect(filterLabel).toBeInTheDocument();
	});
});

test("Filter by user name", () => {
	render(<Users />);

	// Find the search input
	const searchInput = screen.getByTestId("search-word") as HTMLInputElement;

	// Simulate user input in the search input
	fireEvent.change(searchInput, { target: { value: "jamesbond" } });

	// Check if the search input value has changed
	expect(searchInput.value).toBe("jamesbond");
});

test("Displays users filtered by name correctly", () => {
	render(<Users />);

	// Find the search input
	const searchInput = screen.getByTestId("search-word") as HTMLInputElement;

	// Simulate user input in the search input
	const filterValue = "princess";
	fireEvent.change(searchInput, { target: { value: filterValue } });

	// Check if the filtered users are rendered correctly
	const userCards = screen.getAllByTestId("user-card-mail");

	// Extract the mail values from the user cards
	const userMails = userCards.map((card) => card.textContent);

	// Check if the filtered users have the expected mail values
	const expectedUserMails = [
		"princessMcBeauty@gmail.com",
		"princessQueenMcBoo@gmail.com",
		"princessMcBeauty@gmail.com",
		"princessMcBeauty@gmail.com",
	];
	expectedUserMails.forEach((mail) => {
		expect(userMails).toContain(mail);
	});
});

test("Filters users correctly by date", () => {
	render(<Users />);

	// Find the start date input
	const startDateInput = screen.getByTestId("custom-date-start");

	// Simulate user input in the start date input
	const startDateValue = new Date(2010, 9, 5);
	const formattedStartDateValue = startDateValue.toISOString().slice(0, 10);
	fireEvent.change(startDateInput, { target: { value: formattedStartDateValue } });

	// Find the finish date input
	const finishDateInput = screen.getByTestId("custom-date-finish");

	// Simulate user input in the finish date input
	const finishDateValue = new Date();
	const formattedFinishDateValue = finishDateValue.toISOString().slice(0, 10);
	fireEvent.change(finishDateInput, { target: { value: formattedFinishDateValue } });

	// Check if the filtered users are rendered correctly
	const userCards = screen.getAllByTestId("user-card-mail");

	// Extract the mail values from the user cards
	const userMails = userCards.map((card) => card.textContent);

	// Check if the filtered users have the expected mail values
	const expectedUserMails = [
		"princessMcBeauty@gmail.com",
		"princessQueenMcBoo@gmail.com",
		"princessMcBeauty@gmail.com",
		"princessMcBeauty@gmail.com",
	];
	expectedUserMails.forEach((mail) => {
		expect(userMails).toContain(mail);
	});
});

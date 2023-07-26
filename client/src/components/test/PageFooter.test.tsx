/* eslint-disable testing-library/prefer-screen-queries */
import { fireEvent, render } from "@testing-library/react";
import PageFooter from "../PageFooter";

/** Unit testing of utils function */
describe("Page footer", () => {
	test("When page at one, should not change page when click on left arrow", () => {
		const setPageMock = jest.fn();
		const page = 1;
		const maxNumberOfPages = 5;

		const { getByText } = render(
			<PageFooter page={page} maxNumberOfPages={maxNumberOfPages} setPage={setPageMock} />
		);

		const leftButton = getByText("←");
		fireEvent.click(leftButton);
		expect(setPageMock).not.toHaveBeenCalled();
	});

	test("changePage function should update the page number correctly", () => {
		const setPageMock = jest.fn();
		const page = 3;
		const maxNumberOfPages = 5;

		const { getByText } = render(
			<PageFooter page={page} maxNumberOfPages={maxNumberOfPages} setPage={setPageMock} />
		);

		const leftButton = getByText("←");
		fireEvent.click(leftButton);
		expect(setPageMock).toHaveBeenCalledWith(page - 1);

		const rightButton = getByText("→");
		fireEvent.click(rightButton);
		expect(setPageMock).toHaveBeenCalledWith(page + 1);
	});

	test("When at last page, should not change page when click on right arrow", () => {
		const setPageMock = jest.fn();
		const page = 5;
		const maxNumberOfPages = 5;

		const { getByText } = render(
			<PageFooter page={page} maxNumberOfPages={maxNumberOfPages} setPage={setPageMock} />
		);

		const rightButton = getByText("→");
		fireEvent.click(rightButton);
		expect(setPageMock).not.toHaveBeenCalled();
	});
});

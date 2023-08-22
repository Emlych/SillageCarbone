import { render, fireEvent, screen } from "@testing-library/react";
import SmallModal from "../SmallModal";

describe("SmallModal", () => {
	const toggleModalMock = jest.fn();
	const setNeedRefresh = jest.fn();
	const productId = "product_id";

	it("Render without error", () => {
		render(
			<SmallModal
				toggleModal={toggleModalMock}
				accountModalKey="archive-product"
				productId={productId}
				setNeedRefresh={setNeedRefresh}
			/>
		);
		expect(screen.getByText("×")).toBeInTheDocument(); // Close button
	});
	it("Render without error with delete product", () => {
		render(
			<SmallModal
				toggleModal={toggleModalMock}
				accountModalKey="delete-product"
				productId={productId}
				setNeedRefresh={setNeedRefresh}
			/>
		);
		expect(screen.getByText("×")).toBeInTheDocument(); // Close button
	});
	it("Render without error with unarchive product", () => {
		render(
			<SmallModal
				toggleModal={toggleModalMock}
				accountModalKey="unarchive-product"
				productId={productId}
				setNeedRefresh={setNeedRefresh}
			/>
		);
		expect(screen.getByText("×")).toBeInTheDocument(); // Close button
	});

	it("Call toggleModal when clicking on close button", () => {
		render(
			<SmallModal
				toggleModal={toggleModalMock}
				accountModalKey="archive-product"
				productId={productId}
				setNeedRefresh={setNeedRefresh}
			/>
		);

		const closeElement = screen.getByText("×");
		fireEvent.click(closeElement);
		expect(toggleModalMock).toHaveBeenCalled();
	});

	it("Call toggleModal when clicking outside the modal content", () => {
		render(
			<SmallModal
				toggleModal={toggleModalMock}
				accountModalKey="archive-product"
				productId={productId}
				setNeedRefresh={setNeedRefresh}
			/>
		);
		const modal = screen.getByTestId("modal-backdrop");
		expect(modal).toBeInTheDocument(); // Whole modal
		fireEvent.click(modal); // Simulate a click event on the modal backdrop
		expect(toggleModalMock).toHaveBeenCalled();
	});
});

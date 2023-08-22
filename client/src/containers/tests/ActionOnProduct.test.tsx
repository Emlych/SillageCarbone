import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { archiveProduct, deleteProduct } from "../../services/productService";
import ActionOnProduct from "../BackOffice/ActionOnProduct";

// Mocking the archiveProduct and deleteProduct functions
jest.mock("../../services/productService", () => ({
	archiveProduct: jest.fn(() => Promise.resolve()),
	deleteProduct: jest.fn(() => Promise.resolve()),
}));

describe("ActionOnProduct component", () => {
	const setNeedRefresh = jest.fn();

	it("handles archive action correctly", async () => {
		const toggleModalMock = jest.fn();
		render(
			<ActionOnProduct
				toggleModal={toggleModalMock}
				_id="product-id"
				actionType="archive"
				setNeedRefresh={setNeedRefresh}
			/>
		);

		const archiveButton = screen.getByText("Archiver");
		fireEvent.click(archiveButton);

		// Check if the archiveProduct function is called with the correct parameters
		await waitFor(() => {
			expect(archiveProduct).toHaveBeenCalledWith("product-id", true);
		});

		// Check if toggleModal is called
		expect(toggleModalMock).toHaveBeenCalledTimes(1);
	});

	it("handles delete action correctly", async () => {
		const toggleModalMock = jest.fn();
		render(
			<ActionOnProduct
				toggleModal={toggleModalMock}
				_id="product-id"
				actionType="delete"
				setNeedRefresh={setNeedRefresh}
			/>
		);

		const deleteButton = screen.getByText("Supprimer définitivement");
		fireEvent.click(deleteButton);

		// Check if the deleteProduct function is called
		await waitFor(() => {
			expect(deleteProduct).toHaveBeenCalledWith("product-id");
		});

		// Check if toggleModal is called
		expect(toggleModalMock).toHaveBeenCalledTimes(1);
	});

	it("handles unarchive action correctly", async () => {
		const toggleModalMock = jest.fn();
		render(
			<ActionOnProduct
				toggleModal={toggleModalMock}
				_id="product-id"
				actionType="unarchive"
				setNeedRefresh={setNeedRefresh}
			/>
		);

		const unarchiveButton = screen.getByText("Désarchiver");
		fireEvent.click(unarchiveButton);

		// Check if the archiveProduct function is called with the correct parameters
		await waitFor(() => {
			expect(archiveProduct).toHaveBeenCalledWith("product-id", false);
		});

		// Check if toggleModal is called
		expect(toggleModalMock).toHaveBeenCalledTimes(1);
	});

	it("close modal when click on cancel button", async () => {
		const toggleModalMock = jest.fn();
		render(
			<ActionOnProduct
				toggleModal={toggleModalMock}
				_id="product-id"
				actionType="unarchive"
				setNeedRefresh={setNeedRefresh}
			/>
		);

		const cancelButton = screen.getByText("Annuler");
		fireEvent.click(cancelButton);

		// Check if toggleModal is called
		expect(toggleModalMock).toHaveBeenCalledTimes(1);
	});

	it("handles delete product service error", async () => {
		const toggleModalMock = jest.fn();
		(deleteProduct as jest.Mock).mockRejectedValue(new Error("Delete error"));

		// Spy on console.error
		const consoleErrorSpy = jest.spyOn(console, "error");
		consoleErrorSpy.mockImplementation(() => {});

		render(
			<ActionOnProduct
				toggleModal={toggleModalMock}
				_id="product-id"
				actionType="delete"
				setNeedRefresh={setNeedRefresh}
			/>
		);

		const deleteButton = screen.getByText("Supprimer définitivement");
		fireEvent.click(deleteButton);

		await waitFor(() => {
			expect(deleteProduct).toHaveBeenCalledWith("product-id");
			// eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
			expect(consoleErrorSpy).toHaveBeenCalledWith(new Error("Delete error"));
		});

		// Check if toggleModal is called
		expect(toggleModalMock).toHaveBeenCalledTimes(1);

		// Restore the original console.error
		consoleErrorSpy.mockRestore();
	});
	it("handles archive product service error", async () => {
		const toggleModalMock = jest.fn();
		(archiveProduct as jest.Mock).mockRejectedValue(new Error("Archive error"));

		// Spy on console.error
		const consoleErrorSpy = jest.spyOn(console, "error");
		consoleErrorSpy.mockImplementation(() => {});

		render(
			<ActionOnProduct
				toggleModal={toggleModalMock}
				_id="product-id"
				actionType="archive"
				setNeedRefresh={setNeedRefresh}
			/>
		);

		const archiveButton = screen.getByText("Archiver");
		fireEvent.click(archiveButton);

		await waitFor(() => {
			expect(archiveProduct).toHaveBeenCalledWith("product-id", true);
			// eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
			expect(console.error).toHaveBeenCalledWith(new Error("Archive error"));
		});

		// Check if toggleModal is called
		expect(toggleModalMock).toHaveBeenCalledTimes(1);

		// Restore the original console.error
		consoleErrorSpy.mockRestore();
	});
	it("handles unarchive product service error", async () => {
		const toggleModalMock = jest.fn();
		(archiveProduct as jest.Mock).mockRejectedValue(new Error("Unarchive error"));

		// Spy on console.error
		const consoleErrorSpy = jest.spyOn(console, "error");
		consoleErrorSpy.mockImplementation(() => {});

		render(
			<ActionOnProduct
				toggleModal={toggleModalMock}
				_id="product-id"
				actionType="unarchive"
				setNeedRefresh={setNeedRefresh}
			/>
		);

		const unarchiveButton = screen.getByText("Désarchiver");
		fireEvent.click(unarchiveButton);

		await waitFor(() => {
			expect(archiveProduct).toHaveBeenCalledWith("product-id", false);
			// eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
			expect(console.error).toHaveBeenCalledWith(new Error("Unarchive error"));
		});

		// Check if toggleModal is called
		expect(toggleModalMock).toHaveBeenCalledTimes(1);

		// Restore the original console.error
		consoleErrorSpy.mockRestore();
	});
});

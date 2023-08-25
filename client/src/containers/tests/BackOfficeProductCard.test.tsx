import { render, screen, fireEvent } from "@testing-library/react";
import BackofficeProductCard from "../BackOffice/BackofficeProductCard";
import { capitalizeFirstLetter } from "../../utils/format-data-utils";

jest.mock("../../services/userService", () => ({
	fetchUsers: jest.fn(),
}));

describe("Users Container", () => {
	const mockProduct = {
		_id: "productId",
		product_name: "productName",
		company: "company",
		co2: 10,
	};

	it("renders component without error", () => {
		const openConfirmActionModal = jest.fn();
		render(
			<BackofficeProductCard
				openConfirmActionModal={openConfirmActionModal}
				actionType="archive"
				_id="productId"
				product_name="productName"
				company="company"
				co2={10}
			/>
		);

		const toCapitalizeText = [mockProduct.product_name, mockProduct.company];
		for (const text of toCapitalizeText) {
			const mockText = capitalizeFirstLetter(text);
			const expectedText = screen.getByText(mockText);
			expect(expectedText).toBeInTheDocument();
		}

		const co2Value = screen.getByText(`${mockProduct.co2} eq CO2`);
		expect(co2Value).toBeInTheDocument();

		const archiveButton = screen.getByText("Archiver");
		expect(archiveButton).toBeInTheDocument();
	});

	it("renders unarchive button with delete component without error", () => {
		const openConfirmActionModal = jest.fn();
		render(
			<BackofficeProductCard
				openConfirmActionModal={openConfirmActionModal}
				actionType="delete"
				_id="productId"
				product_name="productName"
				company="company"
				co2={10}
			/>
		);

		const unarchiveButton = screen.getByText("Désarchiver");
		expect(unarchiveButton).toBeInTheDocument();
	});

	it("calls openConfirmActionModal when click on unarchive button", async () => {
		const openConfirmActionModal = jest.fn();
		render(
			<BackofficeProductCard
				openConfirmActionModal={openConfirmActionModal}
				actionType="delete"
				_id="productId"
				product_name="productName"
				company="company"
				co2={10}
			/>
		);

		const unarchiveButton = screen.getByText("Désarchiver");
		fireEvent.click(unarchiveButton);

		expect(openConfirmActionModal).toBeCalled();
	});

	it("calls openConfirmActionModal when click on archive button", async () => {
		const openConfirmActionModal = jest.fn();
		render(
			<BackofficeProductCard
				openConfirmActionModal={openConfirmActionModal}
				actionType="archive"
				_id="productId"
				product_name="productName"
				company="company"
				co2={10}
			/>
		);

		const archiveButton = screen.getByText("Archiver");
		fireEvent.click(archiveButton);

		expect(openConfirmActionModal).toBeCalled();
	});
});

import { render, screen } from "@testing-library/react";
import ProductCard from "../../containers/Product/Product_Card";

// Mock data for testing
const product = {
	_id: "id1",
	name: "Sample Product",
	productType: { _id: "idType", name: "Sample type" },
	company: "Sample Company",
	co2: 100,
	origin_harbour: {
		_id: "id1",
		city: "origin city",
		country: "origin country",
	},
	destination_harbour: {
		_id: "id2",
		city: "destination city",
		country: "destination country",
	},
	distance: 500,
	transportation: { _id: "idT", name: "ship" },
	imgUrl: "sample_image_url",
	description: "sample description",
	creation_date: new Date(),
};

it("ProductCard renders correctly", () => {
	render(<ProductCard product={product} />);

	// Check if product name is rendered
	const productNameElement = screen.getByText("Sample Product");
	expect(productNameElement).toBeInTheDocument();

	// Check if company name is rendered
	const companyElement = screen.getByText("Sample Company");
	expect(companyElement).toBeInTheDocument();
});

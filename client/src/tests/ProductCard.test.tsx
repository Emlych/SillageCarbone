import { render, screen } from "@testing-library/react";
import ProductCard from "../containers/Product/Product_Card";

// Mock data for testing
const product = {
	_id: "id1",
	name: "Sample Product",
	type: "Sample type",
	company: "Sample Company",
	co2: 100,
	origin_harbour: "Origin Harbour",
	destination_harbour: "Destination Harbour",
	distance: 500,
	transportation: "Ship",
	imgUrl: "sample_image_url",
	description: "sample description",
	creation_date: new Date(),
};

test("ProductCard renders correctly", () => {
	render(<ProductCard product={product} />);

	// Check if product name is rendered
	const productNameElement = screen.getByText("Sample Product");
	expect(productNameElement).toBeInTheDocument();

	// Check if company name is rendered
	const companyElement = screen.getByText("Sample Company");
	expect(companyElement).toBeInTheDocument();

	// ... Continue checking other elements and their values
});

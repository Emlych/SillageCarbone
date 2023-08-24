import { render } from "@testing-library/react";
import App from "./App";

describe("App Routes", () => {
	it("renders Home component for default route", () => {
		const { container } = render(<App />);
		expect(container).toHaveTextContent("SillageCarbone");
	});
});

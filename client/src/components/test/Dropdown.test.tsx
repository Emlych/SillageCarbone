import { render, fireEvent, screen } from "@testing-library/react";
import Dropdown, { DropdownProps } from "../Dropdown";

describe("Dropdown component", () => {
	// Mock options
	const options: Map<number | string, string> = new Map([
		[1, "Option 1"],
		[2, "Option 2"],
		[3, "Option 3"],
	]);

	/** Simulate a click on an option */
	const handleSelectInput = jest.fn();

	/** Render Dropdown component */
	const setup = (props: Partial<DropdownProps<string>>) => {
		const defaultProps: DropdownProps<string> = {
			options: new Map(),
			handleSelectInput: handleSelectInput,
		};
		const mergedProps = { ...defaultProps, ...props };
		return render(<Dropdown {...mergedProps} />);
	};

	test("renders dropdown options correctly", () => {
		setup({ options });
		const optionElements = screen.getAllByTestId("dropdown-option");

		expect(optionElements.length).toBe(options.size);
		options.forEach((value) => {
			expect(screen.getByText(value)).toBeInTheDocument();
		});
	});

	test("does not render dropdown when options are null", () => {
		setup({ options: null });
		const dropdownElement = screen.queryByTestId("dropdown");
		expect(dropdownElement).toBeNull();
	});

	test("calls handleSelectInput when option is clicked", () => {
		setup({ options });
		const optionElement = screen.getByText("Option 1");
		fireEvent.click(optionElement);
		expect(handleSelectInput).toHaveBeenCalledTimes(1);
		expect(handleSelectInput).toHaveBeenCalledWith(1);
	});

	test("does not render dropdown when options size is 0", () => {
		setup({ options: new Map() });
		const dropdownElement = screen.queryByTestId("dropdown");
		expect(dropdownElement).toBeNull();
	});
});

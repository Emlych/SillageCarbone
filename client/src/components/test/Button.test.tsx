import { render, fireEvent, screen } from "@testing-library/react";
import Button from "../Button";

describe("Button component", () => {
	it("renders button text correctly", () => {
		const buttonText = "Click me";
		render(<Button buttonText={buttonText} buttonType={"button"} />);
		const buttonElement = screen.getByText(buttonText);
		expect(buttonElement).toBeInTheDocument();
	});

	it("calls the callback function when clicked", () => {
		const callback = jest.fn();
		render(<Button buttonText="click me" buttonType="submit" callback={callback} />);
		const buttonElement = screen.getByText("click me");
		fireEvent.click(buttonElement);
		expect(callback).toHaveBeenCalledTimes(1);
	});

	it("renders with the specified button type", () => {
		render(<Button buttonText="click me" buttonType="button" />);
		const buttonElement = screen.getByTestId("submit");
		expect(buttonElement.getAttribute("type")).toBe("button");
	});

	it("renders with the 'disabled' attribute when disabled prop is true", () => {
		render(<Button buttonText="click me" buttonType="button" disabled={true} />);
		const buttonElement = screen.getByText("click me");
		expect(buttonElement).toBeDisabled();
	});

	it("renders with the 'alert' CSS class when alert prop is true", () => {
		render(<Button buttonText="click me" buttonType="button" alert={true} />);
		const buttonElement = screen.getByText("click me");
		expect(buttonElement).toHaveClass("red");
	});
});

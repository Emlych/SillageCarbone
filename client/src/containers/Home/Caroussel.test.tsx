import { render, fireEvent, screen } from "@testing-library/react";
import CarouselHome from "./Caroussel.container";

describe("CarouselHome", () => {
	const mockArticles = [
		{ title: "Article 1", text: "Text 1" },
		{ title: "Article 2", text: "Text 2" },
		{ title: "Article 3", text: "Text 3" },
	];

	it("Scroll to the next article when the right arrow button is clicked", () => {
		render(<CarouselHome articles={mockArticles} />);
		const carousel = screen.getByTestId("carousel");
		const previousArrowButton = screen.getByTestId("previous-arrow");
		fireEvent.click(previousArrowButton);
		expect(carousel.scrollLeft).toBe(carousel.offsetWidth);
	});

	it("Scroll to the previous article when the left arrow button is clicked", () => {
		render(<CarouselHome articles={mockArticles} />);
		const carousel = screen.getByTestId("carousel");
		const nextArrowButton = screen.getByTestId("next-arrow");
		fireEvent.click(nextArrowButton);
		expect(carousel.scrollLeft).toBe(0);
	});

	it("Scroll to the next article when the mouse wheel is scrolled down", () => {
		render(<CarouselHome articles={mockArticles} />);
		const carousel = screen.getByTestId("carousel");
		fireEvent.wheel(carousel, { deltaY: 100 });
		expect(carousel.scrollLeft).toBe(carousel.offsetWidth);
	});

	it("Scroll to the previous article when the mouse wheel is scrolled up", () => {
		render(<CarouselHome articles={mockArticles} />);
		const carousel = screen.getByTestId("carousel");
		fireEvent.wheel(carousel, { deltaY: -100 });
		expect(carousel.scrollLeft).toBe(0);
	});
});

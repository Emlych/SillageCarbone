/** Carousel of slides that will go to previous / next article each time you click on an arrow button or scroll vertically */

import { useEffect, useRef } from "react";
import "../../styling/carouselHome.css";
import ArticleCard from "../../components/Home/ArticleCard";

interface CarouselProps {
	articles: Article[];
}
interface Article {
	title: string;
	text: string;
}

const CarouselHome: React.FC<CarouselProps> = ({ articles }) => {
	const carouselRef = useRef<HTMLDivElement>(null);

	/** Apply offset on article position */
	const scrollSlide = (direction: "previous" | "next") => {
		if (carouselRef.current) {
			if (direction === "next") {
				carouselRef.current.scrollLeft += carouselRef.current.offsetWidth;
			} else {
				carouselRef.current.scrollLeft -= carouselRef.current.offsetWidth;
			}
		}
	};

	useEffect(() => {
		/** Apply offset on article on scroll */
		const handleWheelScroll = (ev: WheelEvent) => {
			const delta = ev.deltaY;
			scrollSlide(delta > 0 ? "next" : "previous");
		};

		// Set value to avoid following warning message : Ref value 'carouselRef.current' will likely have changed by the time this effect cleanup function runs.
		const currentRef = carouselRef.current;
		if (currentRef) {
			currentRef.addEventListener("wheel", (event) => handleWheelScroll(event));
			return () => {
				currentRef.removeEventListener("wheel", (event) => handleWheelScroll(event));
			};
		}
	}, []);

	return (
		<div className="carousel-container">
			<div className="carousel" ref={carouselRef} data-testid="carousel">
				{articles.map((article, index) => (
					<div className="article" key={index}>
						<ArticleCard title={article.title} text={article.text} />
					</div>
				))}
			</div>
			<button
				className="arrow left"
				onClick={() => scrollSlide("previous")}
				data-testid="previous-arrow"
			>
				&larr;
			</button>
			<button
				className="arrow right"
				onClick={() => scrollSlide("next")}
				data-testid="next-arrow"
			>
				&rarr;
			</button>
		</div>
	);
};
export default CarouselHome;

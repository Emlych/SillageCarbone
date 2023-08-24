// Component containing a search bar to research product
import Autocomplete from "./Autocomplete.container";
import "../../styling/searchhero.css";
import { useState } from "react";

const SearchHero = () => {
	// Define position of boat when move mouse on screen
	const [imagePositionX, setImagePositionX] = useState(-30); // Initial horizontal position of the boat
	const [offsetX, setOffsetX] = useState(0); // Offset to adjust the boat's position
	const [isMouseInside, setIsMouseInside] = useState(false); // Tracks if the mouse is inside the container
	const [prevMouseX, setPrevMouseX] = useState(0); // Stores the previous mouse position

	const period = 10; // Period for the sine wave motion
	const amplitude = 3; // Amplitude of the sine wave

	const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
		setIsMouseInside(true);
		setPrevMouseX(e.clientX); // Store the initial mouse position when entering
	};
	const handleMouseLeave = () => {
		setIsMouseInside(false); // Mark that the mouse is no longer inside
	};
	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const mouseX = e.clientX;

		if (isMouseInside) {
			const distance = Math.abs(mouseX - prevMouseX) / 40; // Calculate the distance moved by mouse
			const newOffsetX = distance + offsetX / window.innerWidth; // Normalize the offset
			const newImagePositionX = imagePositionX + newOffsetX; // Calculate new image position

			setImagePositionX(newImagePositionX); // Update the image's horizontal position
			setOffsetX(newOffsetX); // Update the offset
			setPrevMouseX(mouseX); // Update the previous mouse position
		}
	};

	return (
		<div
			data-testid="search-hero"
			className="searchhero"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onMouseMove={handleMouseMove}
		>
			<img
				src="https://res.cloudinary.com/deby3jois/image/upload/v1692891050/sillage/411c1ab4-4292-11ee-b439-76e262d388c7_cnv0lc.png"
				alt="Bateau qui se déplace de gauche à droite de l'écran"
				style={{
					top: `${amplitude * Math.sin(period * (imagePositionX / 100))}%`, // Ajustement pour décaler le sommet de la vague vers le bas
				}}
			/>
			<h2>Rechercher le bilan carbone d'un produit</h2>

			{/* Search bar */}
			<Autocomplete />
		</div>
	);
};

export default SearchHero;

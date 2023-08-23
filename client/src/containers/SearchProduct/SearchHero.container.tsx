// Component containing a search bar to research product
import Autocomplete from "./Autocomplete.container";
import "../../styling/searchhero.css";

const SearchHero = () => {
	return (
		<div data-testid="search-hero" className="searchhero">
			{/* <div className="backgroundImage">
				<div className="svg-container">
					<img src="image1.svg" alt="Image 1" />
				</div>
				<div className="svg-container">
					<img src="image2.svg" alt="Image 2" />
				</div>
			</div> */}
			<h2>Rechercher le bilan carbone d'un produit</h2>

			{/* Search bar */}
			<Autocomplete />
		</div>
	);
};

export default SearchHero;

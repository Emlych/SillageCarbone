// Component containing a search bar to research product
// Search should function with autocomplete
import Autocomplete from "./Autocomplete.container";
import "../../styling/searchhero.css";

const SearchHero = () => {
	return (
		<div data-testid="search-hero" className="searchhero">
			<h2>Rechercher le bilan carbone d'un produit</h2>

			{/* Search bar */}
			<Autocomplete />
		</div>
	);
};

export default SearchHero;

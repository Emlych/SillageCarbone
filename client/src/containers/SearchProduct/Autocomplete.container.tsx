import { useEffect, useMemo, useState } from "react";
import { formatTextToString } from "../../utils/format-data-utils";
import "../../styling/autocomplete.css";

//icons
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Dropdown, { DropdownProps } from "../../components/Dropdown";
import axios from "axios";
import { Product } from "../../dto/ProductDto";

interface ProductCache {
	[_id: number]: Product;
}

/** Component that contains :
 * - Text input
 * - Dropdown list of suggestions for autocompletion
 * */
const Autocomplete = () => {
	const navigate = useNavigate();

	// All products from database
	const [products, setProducts] = useState<Product[]>();
	// Name of product that should be retrieved from database
	const [searchedProduct, setSearchedProduct] = useState("");
	// List of products to suggest to user
	const [suggestions, setSuggestions] = useState<Map<number, string> | null>(null);

	/** On first load of this component, retrieve products from database and store them in products*/
	useEffect(() => {
		const fetchAndFilterProductsData = async () => {
			try {
				const url = "http://localhost:8000/products/cache";
				const response = await axios.get(url);

				if (!response.data?.products) {
					throw new Error("No products retrieved");
				}

				// -- Update products
				setProducts(response.data.products);
			} catch (error) {
				console.error("Error ", error);
			}
		};
		fetchAndFilterProductsData();
	}, []);

	/** Store products in cache only when products array is updated */
	const productCache = useMemo<ProductCache>(() => {
		const cache: ProductCache = {};

		if (products) {
			products.forEach((product) => {
				product.keywords =
					formatTextToString(product.name) + " " + formatTextToString(product.company);
				cache[product._id] = product;
			});
		}

		return cache;
	}, [products]);

	/** On change of input value, retrieve list of corresponding products to update autocompletion suggestions list */
	const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const inputValue: string = event.target.value;
		setSearchedProduct(inputValue);

		// Return empty list in case user erases his search
		if (inputValue.length <= 2) {
			setSuggestions(null);
			return;
		}

		// Format input value (no case sensitive, accents, spaces)
		let inputKeywords = formatTextToString(inputValue);

		// Provide list of products which match with inputValue and store its id and name inside a map
		const matchingProducts = new Map<number, string>();
		for (const product in productCache) {
			const hasMatchInName = productCache[product].keywords.includes(inputKeywords);

			// Check length of inputKeywords: formatTextToString can return an empty string (need to prevent displayText from displaying all products in cache)
			if (hasMatchInName && inputKeywords.length > 0) {
				const displayText =
					productCache[product].name + " - " + productCache[product].company;
				matchingProducts.set(productCache[product]._id, displayText);
				setSuggestions(matchingProducts);
			}
		}
	};

	/** On select of value, send request to server side to retrieve Product information and open Product page */
	const MapContentNumberStringProps: DropdownProps<string> = {
		options: suggestions,
		handleSelectInput: (key: number) => {
			navigate(`/product/${key}`);
		},
	};

	return (
		<div data-testid="autocomplete" className="autocomplete">
			<p>Entrer le nom et la marque d'un produit</p>
			<div className="autocomplete-searchbar">
				<label htmlFor="mail">
					<FontAwesomeIcon icon={faSearch} />
				</label>
				<div>
					<input
						placeholder="Rechercher un produit"
						value={searchedProduct}
						onChange={handleSearchInput}
					/>

					{/* List of all items by div - dropdown menu UI */}
					{suggestions && suggestions.size > 0 && (
						<Dropdown<string> {...MapContentNumberStringProps} />
					)}
				</div>
			</div>
		</div>
	);
};

export default Autocomplete;

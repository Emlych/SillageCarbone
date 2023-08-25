import "./productcard.css";
import {
	faLocationDot,
	faRoute,
	faShip,
	faSmog,
	faWarehouse,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Cookies from "js-cookie";
import { capitalizeFirstLetter } from "../../utils/format-data-utils";
import Button from "../../components/Button";
import CardItem from "../../components/CardItem";
import { DetailedProduct } from "../../dto/ProductDto";

// Component ProductCard displayed in product page
const ProductCard = ({ product }: { product: DetailedProduct }) => {
	// State to track whether the product is marked as favorite (version 2)
	const [isFav, setIsFav] = useState(false);

	// Check if user is connected to access to favorite button
	const userToken = Cookies.get("userToken");

	// Capitalize first letter of product's name
	const productName = capitalizeFirstLetter(product.name);

	return (
		<div className="productCard">
			<div className="productCard-container">
				{/* Display product information */}
				<div className="product-info">
					<h2 className="product-name">{productName}</h2>
					<CardItem text={product.company} faIcon={faWarehouse} />
					<CardItem text={`${product.co2} eq CO2`} faIcon={faSmog} />
					<CardItem
						text={`Port d'origine: ${product.origin_harbour.city} (${product.origin_harbour.country})`}
						faIcon={faLocationDot}
					/>
					<CardItem
						text={`Port d'arrivée: ${product.destination_harbour.city} (${product.destination_harbour.country})`}
						faIcon={faLocationDot}
					/>
					<CardItem text={`Distance parcourue: ${product.distance}km`} faIcon={faRoute} />

					<CardItem text={`Transport: ${product.transportation.name}`} faIcon={faShip} />
				</div>

				{/* Display product image and favorite button */}
				<div className="image-and-button">
					<div className="product-picture">
						<img src={product.imgUrl} alt="" />
					</div>
					{userToken && userToken.length > 0 && (
						<Button
							buttonText={isFav ? "Ajouter aux favoris" : "Retirer des favoris"}
							buttonType="button"
							callback={() => setIsFav(!isFav)}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default ProductCard;

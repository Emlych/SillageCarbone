import "./productcard.css";
import { useState } from "react";
import { capitalizeFirstLetter } from "../../utils/format-data-utils";
import Button from "../../components/Button";
import CardItem from "../../components/CardItem";
import {
	faLocationDot,
	faRoute,
	faShip,
	faSmog,
	faWarehouse,
} from "@fortawesome/free-solid-svg-icons";
import { DetailedProduct } from "../../dto/ProductDto";

const ProductCard = ({ product }: { product: DetailedProduct }) => {
	const [isFav, setIsFav] = useState(false);
	const productName = capitalizeFirstLetter(product.name);

	return (
		<div className="productCard">
			<div className="productCard-container">
				<div className="product-info">
					<h2 className="product-name">{productName}</h2>
					<CardItem text={product.company} faIcon={faWarehouse} />
					<CardItem text={`${product.co2} eq CO2`} faIcon={faSmog} />
					<CardItem
						text={`Port d'origine: ${product.origin_harbour}`}
						faIcon={faLocationDot}
					/>
					<CardItem
						text={`Port d'arrivée: ${product.destination_harbour}`}
						faIcon={faLocationDot}
					/>
					<CardItem text={`Distance parcourue: ${product.distance}km`} faIcon={faRoute} />

					<CardItem text={`Transport: ${product.transportation}`} faIcon={faShip} />
				</div>

				<div className="image-and-button">
					<div className="product-picture">
						<img src={product.imgUrl} alt="" />
					</div>
					<Button
						buttonText={isFav ? "Ajouter aux favoris" : "Retirer des favoris"}
						buttonType="button"
						callback={() => setIsFav(!isFav)}
					/>
				</div>
			</div>
		</div>
	);
};

export default ProductCard;

import "../../pages/modal.css";
import CardItem from "../../components/CardItem";
import {
	faCalendar,
	faCommentDots,
	faLocationDot,
	faRoute,
	faShip,
	faSmog,
	faTag,
	faWarehouse,
} from "@fortawesome/free-solid-svg-icons";
import { formatDate, formattedDate } from "../../utils/format-data-utils";
import Button from "../../components/Button";
import { useEffect, useState } from "react";
import { DetailedProduct } from "../../dto/ProductDto";
import { fetchProductById } from "../../services/productService";

type ProductDetailProps = {
	_id: string;
};

const ProductDetail = ({ _id }: ProductDetailProps) => {
	const [product, setProduct] = useState<DetailedProduct | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [creationDate, setCreationDate] = useState<formattedDate>("dd-mm-yyyy");

	/** Read data associated with product _id on page loading */
	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const product = await fetchProductById(_id);
				setProduct(product);

				const creationDate = product.creation_date;

				if (creationDate) {
					const convertDateFormat = formatDate(
						new Date(creationDate),
						"dd-mm-yyyy"
					) as formattedDate;
					setCreationDate(convertDateFormat);
				}
				setIsLoading(false);
			} catch (error: any) {
				throw new Error(error.message);
			}
		};
		fetchProduct();
	}, [_id]);

	// Functions to manipulate product data (modify / delete)
	const deleteProduct = () => {
		console.log("delete product");
	};
	const modifyProduct = () => {
		console.log("modify product");
	};

	return (
		<div>
			{!isLoading && product && (
				<div>
					<h2 className="product-name">{product.name}</h2>
					<CardItem text={`Marque : ${product.company}`} faIcon={faWarehouse} />
					<CardItem text={`${product.co2}eq CO2`} faIcon={faSmog} />
					<CardItem text={`Type de produit: ${product.type}`} faIcon={faTag} />
					<CardItem
						text={`Port d'origine: ${product.origin_harbour}`}
						faIcon={faLocationDot}
					/>
					<CardItem
						text={`Port d'arrivée: ${product.destination_harbour}`}
						faIcon={faLocationDot}
					/>
					<CardItem text={`Distance parcourue: ${product.distance}`} faIcon={faRoute} />
					{product.description && (
						<CardItem
							text={`Description: ${product.description}`}
							faIcon={faCommentDots}
						/>
					)}
					<CardItem
						text={`Date de création de l'article : ${creationDate}`}
						faIcon={faCalendar}
					/>
					<CardItem
						text={`Type de transport: ${product.transportation}`}
						faIcon={faShip}
					/>
					<div className="product-picture">
						<img src="" alt="" />
					</div>
					<div className="product-modal-button">
						<Button buttonText="Modifier" buttonType="button" callback={modifyProduct} />
						<Button buttonText="Supprimer" buttonType="button" callback={deleteProduct} />
					</div>
				</div>
			)}
		</div>
	);
};

export default ProductDetail;

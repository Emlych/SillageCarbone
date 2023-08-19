import "../../pages/modal.css";
import "./productDetail.css";
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
				// -- Retrieve product data by providing its id
				const product = await fetchProductById(_id);
				setProduct(product);

				// -- Format creation date to dd-mm-yyyy
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

	return (
		<div data-testid="product-detail">
			{!isLoading && product && (
				<div>
					<h2 className="product-name">{product.name}</h2>
					<div className="product-detail">
						{product.imgUrl?.length > 0 && (
							<div className="product-picture">
								<img src={product.imgUrl} alt={product.name} />
							</div>
						)}

						<div>
							<CardItem text={`Marque : ${product.company}`} faIcon={faWarehouse} />
							<CardItem text={`${product.co2}eq CO2`} faIcon={faSmog} />
							<CardItem
								text={`Type de produit: ${product.productType.name}`}
								faIcon={faTag}
							/>
							<CardItem
								text={`Port d'origine: ${product.origin_harbour.city} (${product.origin_harbour.country})`}
								faIcon={faLocationDot}
							/>
							<CardItem
								text={`Port d'arrivée: ${product.destination_harbour.city} (${product.destination_harbour.country})`}
								faIcon={faLocationDot}
							/>
							<CardItem
								text={`Distance parcourue: ${product.distance}`}
								faIcon={faRoute}
							/>
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
								text={`Transport: ${product.transportation.name}`}
								faIcon={faShip}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProductDetail;

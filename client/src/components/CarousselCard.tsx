import { CarousselProduct } from "../dto/ProductDto";

const CarousselCard = ({ product }: { product: CarousselProduct }) => {
	return (
		<div className="carousselCard">
			<div>{product.name}</div>
			<div>{product.company}</div>
			<div>{product.co2}</div>
		</div>
	);
};

export default CarousselCard;

import CarousselCard from "../../components/CarousselCard";
import "../../styling/caroussel.css";
import { useNavigate } from "react-router-dom";
import { CarousselProduct } from "../../dto/ProductDto";

// Component to display caroussel
const Caroussel = ({ products }: { products: CarousselProduct[] }) => {
	//-- Enable navigation
	const navigate = useNavigate();

	/** Function to navigate to the individual product page */
	const navigateToProduct = (id: number) => {
		navigate(`/product/${id}`);
	};

	return (
		<div className="caroussel">
			<h2>Alternatives</h2>
			<div className="carousselCards">
				{/* Mapping through the products array to render each product card */}
				{products.map((product) => (
					<div key={product._id} onClick={() => navigateToProduct(product._id)}>
						<CarousselCard product={product} />
					</div>
				))}
			</div>
		</div>
	);
};

export default Caroussel;

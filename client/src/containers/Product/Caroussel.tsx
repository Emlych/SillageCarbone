import CarousselCard from "../Home/CarousselCard";
import "../../styling/caroussel.css";
import { CarousselProduct } from "../../pages/Product.page";
import { useNavigate } from "react-router-dom";

const Caroussel = ({ products }: { products: CarousselProduct[] }) => {
	//	Redirect to new product page
	const navigate = useNavigate();
	const navigateToProduct = (id: number) => {
		navigate(`/product/${id}`);
	};

	return (
		<div className="caroussel">
			<div>ALTERNATIVES</div>
			<div className="carousselCards">
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

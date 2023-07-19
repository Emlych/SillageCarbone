import "../../styling/productcard.css";

const NoProductCard = () => {
	return (
		<div className="productCard">
			<div className="productCard-container">
				Cette référence de produit n'existe pas, veuillez modifier votre recherche.
			</div>
		</div>
	);
};

export default NoProductCard;

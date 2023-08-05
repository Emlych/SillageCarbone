/** Product page to display detailed information on product */
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { CarousselProduct, DetailedProduct } from "../dto/ProductDto";
// Containers
import SearchHero from "../containers/SearchProduct/SearchHero.container";
import ProductCard from "../containers/Product/Product_Card";
import Caroussel from "../containers/Product/Caroussel";
import { fetchProductById, fetchSimilarProducts } from "../services/productService";
import { ToastContainer, toast } from "react-toastify";

const Product = () => {
	// -- id of product inside database
	const { _id } = useParams();

	// -- States for display product detail
	const [product, setProduct] = useState<DetailedProduct | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// -- States for displaying products in caroussel
	const [caroussel, setCaroussel] = useState<CarousselProduct[] | null>(null);
	const [isCarousselLoading, setIsCarousselLoading] = useState(true);
	const [productType, setProductType] = useState("");
	const [excludeId, setExcludeId] = useState("");

	/** Read data associated with product _id on page loading */
	useEffect(() => {
		const fetchProduct = async () => {
			try {
				if (!_id) {
					throw new Error("Missing id");
				}
				const productData = await fetchProductById(_id);
				setProduct(productData);
				setProductType(productData.productType.name);
				setExcludeId(productData._id);
				setIsLoading(false);
			} catch (error: any) {
				toast.error(`Le produit recherché n'a pu être extrait de la base de données.`);
				throw new Error(error.message);
			}
		};
		fetchProduct();
	}, [_id]);

	/** Retrieve first 3 products of same type */ //TODO: infinite scroll
	useEffect(() => {
		const fetchSimilarProductsData = async () => {
			try {
				const products = await fetchSimilarProducts(productType, excludeId);
				setCaroussel(products);
				setIsCarousselLoading(false);
			} catch (error) {
				toast.error("Erreur dans l'extraction de produits du même type.");
				setIsCarousselLoading(false);
			}
		};
		if (!isLoading) {
			fetchSimilarProductsData();
		}
	}, [productType, excludeId, isLoading]);

	return (
		<div>
			{/* Display product details and caroussel of similar products */}
			{!isLoading && product && (
				<div>
					{/* Product Card */}
					<ProductCard product={product} />

					{/* Caroussel : pass into it product type */}
					{!isCarousselLoading && caroussel && caroussel.length > 0 && (
						<Caroussel products={caroussel} />
					)}
				</div>
			)}

			{/* Search bar for another research */}
			<SearchHero />

			<ToastContainer position="bottom-right" autoClose={5000} />
		</div>
	);
};

export default Product;

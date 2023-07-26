/** Product page to display detailed information on product */
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { DetailedProduct } from "../dto/ProductDto";
// Containers
import SearchHero from "../containers/SearchProduct/SearchHero.container";
import ProductCard from "../containers/Product/Product_Card";
import Caroussel from "../containers/Product/Caroussel";
import NoProductCard from "../containers/Product/NoProduct_Card";
import { fetchProductById, fetchSimilarProducts } from "../services/productService";

export type CarousselProduct = {
	_id: number;
	name: string;
	company: string;
	co2: number;
};

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
				//const url = `http://localhost:8001/product/${_id}`;
				const productData = await fetchProductById(_id);
				setProduct(productData);
				setProductType(productData.type);
				setExcludeId(productData._id);

				// const response = await axios.get(url);
				// const productData = response.data;
				// if (!productData) {
				// 	console.error("No product was found");
				// 	throw new Error("Product not found");
				// }
				// setProduct(response.data.product);
				// setProductType(response.data.product.type);
				// setExcludeId(response.data.product._id);
				setIsLoading(false);
			} catch (error: any) {
				console.error(error);
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
				console.error(error);
				setIsCarousselLoading(false);
			}
		};
		if (!isLoading) {
			fetchSimilarProductsData();
		}

		// const fetchProductOfSameType = async (productType: string, excludeId: number) => {
		// 	// -- Prevent from sending before main product has been loaded
		// 	if (!isLoading) {
		// 		const url = `http://localhost:8001/products/`;
		// 		try {
		// 			const response = await axios.get(url, {
		// 				params: { type: productType, excludeId, limit: 3, page: 1 },
		// 			});

		// 			if (!response.data?.products) {
		// 				throw new Error("No products retrieved");
		// 			}

		// 			// -- Update products for caroussel
		// 			const products = response.data.products;
		// 			setCaroussel(products);

		// 			// -- Allow display of caroussel
		// 			setIsCarousselLoading(false);
		// 		} catch (error: any) {
		// 			console.error(error);
		// 			throw new Error(error.message);
		// 		}
		// 	}
		// };
		// fetchProductOfSameType(productType, excludeId);
	}, [productType, excludeId, isLoading]);

	return (
		<div>
			{/* Display message if product is missing */}
			{isLoading && <NoProductCard />}

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
		</div>
	);
};

export default Product;

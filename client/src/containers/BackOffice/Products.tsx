/** Backoffice Products Container : display all products with filter */
import {
	faBoxOpen,
	faHashtag,
	faRefresh,
	faTag,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

// Components
import Input from "../../components/Input";
import BackofficeProductCard from "./BackofficeProductCard";
import PageFooter from "../../components/PageFooter";
import Modal from "../../pages/Modal";
import { ToastContainer, toast } from "react-toastify";
import { fetchProducts } from "../../services/productService";
import { ProductWithCO2 } from "../../dto/ProductDto";
import SmallModal from "../../pages/SmallModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type BackofficeProductComponentsProps = {
	archivedProducts?: boolean;
};

const Products = ({ archivedProducts }: BackofficeProductComponentsProps) => {
	// -- User data loaded
	const [isLoading, setIsLoading] = useState(true);

	// -- Page needs to be refreshed
	const [needRefresh, setNeedRefresh] = useState(false);

	/** Refresh page */
	const refreshPage = () => {
		setNeedRefresh(false);
		window.location.reload();
	};

	// -- Filters state
	const [params, setParams] = useState({ name: "", company: "" });
	/** Search filter: set the filter parameters (params) of product name, start and finish dates */
	const handleFilterInput = (
		event: React.ChangeEvent<HTMLInputElement>,
		type: "product-name" | "company"
	) => {
		let newParams = { ...params };

		if (type === "product-name") {
			newParams = {
				...newParams,
				name: event.target.value,
			};
		}
		if (type === "company") {
			newParams = {
				...newParams,
				company: event.target.value,
			};
		}

		setParams(newParams);
	};

	// -- Limit quantity of users per page
	const [page, setPage] = useState<number>(1);
	const [limitPerPage, setLimitPerPage] = useState<number>(4);
	const [maxNumberOfPages, setMaxNumberOfPages] = useState<number>(1);

	// -- On update of filter params, update user data to display
	const [products, setProducts] = useState<ProductWithCO2[]>();
	useEffect(() => {
		const fetchAndFilterProductsData = async (params: {
			name: string;
			company: string;
		}) => {
			try {
				const productsData = await fetchProducts(
					params.name,
					params.company,
					limitPerPage,
					page,
					archivedProducts
				);
				setProducts(productsData.products);

				// -- Update max number of pages for footer
				const maxNumberOfPages =
					productsData.count > 0 ? Math.ceil(productsData.count / limitPerPage) : 1;
				setMaxNumberOfPages(maxNumberOfPages);

				// -- Allow display of products
				setIsLoading(false);
			} catch (error) {
				toast.error(`Erreur dans la récupération des produits`);
			}
		};
		fetchAndFilterProductsData(params);
	}, [params, page, limitPerPage, archivedProducts]);

	// -- Toggle modals for detailed product, archive or deletion
	const [detailModalIsOpen, setDetailModalOpen] = useState(false);
	const [archiveModalIsOpen, setArchiveModalIsOpen] = useState(false);
	const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
	const [unarchiveModalIsOpen, setUnarchiveModalIsOpen] = useState(false);
	const toggleActionModal = (
		actionType: "archive" | "delete" | "unarchive" | "detail"
	) => {
		if (actionType === "archive") {
			setArchiveModalIsOpen(!archiveModalIsOpen);
		} else if (actionType === "delete") {
			setDeleteModalIsOpen(!deleteModalIsOpen);
		} else if (actionType === "unarchive") {
			setUnarchiveModalIsOpen(!unarchiveModalIsOpen);
		} else if (actionType === "detail") {
			setDetailModalOpen(!detailModalIsOpen);
		}
	};

	//--  Open action modal and pass product _id in it
	const [idProductWithAction, setIdProductWithAction] = useState("");
	const openConfirmActionModal = (
		_id: string, // -- id of product concerned by modification
		actionType: "archive" | "delete" | "unarchive" | "detail"
	) => {
		if (_id) {
			toggleActionModal(actionType); // Change state of modalIsOpen
			setIdProductWithAction(_id); // Store in state the id of product on which to apply action
		}
	};

	return (
		<div>
			<div className="backoffice-header">
				<h2>Liste des produits {archivedProducts && "archivés"}</h2>
				{needRefresh && (
					<FontAwesomeIcon
						icon={faRefresh}
						className="refresh-icon"
						onClick={refreshPage}
						data-testid="refresh-icon"
					/>
				)}
			</div>

			<p>Filtrer par : </p>

			{/* Filter products */}
			<div className="filter">
				<div className="filter-search-name-container">
					{/* Filter by user name */}
					<div className="filter-input">
						<label htmlFor="Search by user name" className="filter-search-name-container">
							Nom de produit
						</label>
						<Input
							faIcon={faBoxOpen}
							placeholderText="Nom du produit"
							data-testid="product-name"
							onChange={(event) => handleFilterInput(event, "product-name")}
							type="text"
						/>
					</div>
					<div className="filter-input">
						<label
							htmlFor="Search by company name"
							className="filter-search-name-container"
						>
							Marque
						</label>
						<Input
							faIcon={faTag}
							placeholderText="Marque"
							data-testid="company"
							onChange={(event) => handleFilterInput(event, "company")}
							type="text"
						/>
					</div>
					<div className="filter-input">
						{/* Filter by user name */}
						<label htmlFor="Search by user name" className="filter-search-name-container">
							Quantité par page:
						</label>

						<Input
							faIcon={faHashtag}
							placeholderText=""
							data-testid="limitPerPage"
							onChange={(event) => {
								const inputValue = Number(event.target.value);
								if (!isNaN(inputValue) && inputValue > 0) {
									setLimitPerPage(inputValue);
								}
							}}
							type="number"
						/>
					</div>
				</div>
			</div>

			{isLoading && <span>En cours de chargement...</span>}

			{!isLoading && products && products.length > 0 && (
				<div>
					<div className="products">
						{products.map((product) => (
							<div
								key={product._id}
								onClick={() => openConfirmActionModal(product._id, "detail")}
							>
								<BackofficeProductCard
									_id={product._id}
									product_name={product.name}
									company={product.company}
									co2={product.co2}
									actionType={archivedProducts ? "delete" : "archive"}
									openConfirmActionModal={openConfirmActionModal}
								/>
							</div>
						))}
					</div>
					{/* Modal for product details */}
					{detailModalIsOpen && (
						<Modal
							toggleModal={() => toggleActionModal("detail")}
							accountModalKey={"product-detail"}
							productId={idProductWithAction}
						/>
					)}

					{/* Modal for product deletion */}
					{archiveModalIsOpen && (
						<SmallModal
							toggleModal={() => toggleActionModal("archive")}
							accountModalKey="archive-product"
							productId={idProductWithAction}
							setNeedRefresh={setNeedRefresh}
						/>
					)}
					{/* Modal for product deletion */}
					{deleteModalIsOpen && (
						<SmallModal
							toggleModal={() => toggleActionModal("delete")}
							accountModalKey="delete-product"
							productId={idProductWithAction}
							setNeedRefresh={setNeedRefresh}
						/>
					)}
					{/* Modal for product unarchive */}
					{unarchiveModalIsOpen && (
						<SmallModal
							toggleModal={() => toggleActionModal("unarchive")}
							accountModalKey="unarchive-product"
							productId={idProductWithAction}
							setNeedRefresh={setNeedRefresh}
						/>
					)}
					<PageFooter page={page} maxNumberOfPages={maxNumberOfPages} setPage={setPage} />
				</div>
			)}

			{!isLoading && products && products.length === 0 && (
				<span>Pas de produit à afficher.</span>
			)}

			<ToastContainer position="bottom-right" autoClose={5000} />
		</div>
	);
};
export default Products;

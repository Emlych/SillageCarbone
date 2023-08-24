/** Backoffice Products Tags : manage transportation, product types, companies, ...*/
import {
	faPen,
	faShip,
	faSmog,
	faTrash,
	faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import Input from "../../components/Input";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import "./productTags.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer, toast } from "react-toastify";
import {
	createNewTransportation,
	deleteTransportation,
	fetchTransportations,
} from "../../services/productService";
import { Transportation } from "../../dto/TransportationDto";

const ProductTags = () => {
	//-- States for transportation
	const [newTransportation, setNewTransportation] = useState("");
	const [carbonCoef, setCarbonCoef] = useState<number | string>(1);
	const [allTransportations, setAllTransportations] = useState<Transportation[] | null>(
		null
	);
	// -- Page needs to be refreshed
	const [needRefresh, setNeedRefresh] = useState(false);

	/** Initialize form */
	const initForm = () => {
		setNewTransportation("");
		setCarbonCoef(1);
	};

	/** Refresh page */
	const refreshPage = () => {
		setNeedRefresh(false);
		window.location.reload();
	};

	/** Create transportation */
	const createTransportation = async (event: React.FormEvent) => {
		event.preventDefault();

		const fetchData = async () => {
			try {
				if (typeof carbonCoef === "number") {
					createNewTransportation(newTransportation, carbonCoef);
					toast(`Transport ${newTransportation} créé `);
					initForm();
					setNeedRefresh(true);
				} else {
					throw new Error("Check type of carbonCoef");
				}
			} catch (error) {
				toast.error(`Erreur dans la création d'un nouveau transport`);
			}
		};
		fetchData();
	};

	/** Retrieve all transportations on page load*/
	useEffect(() => {
		const fetchAndFilterProductsData = async () => {
			try {
				const transportations = await fetchTransportations();
				setAllTransportations(transportations);
			} catch (error) {
				toast.error(`Erreur dans l'extraction des moyens de transport`);
			}
		};
		fetchAndFilterProductsData();
	}, []);

	/** Delete Transportation */
	const deleteTransportationService = async (_id: string, name: string) => {
		try {
			const result = await deleteTransportation(_id);
			if (result.success) {
				toast(`Transport ${name} supprimé `);
				window.location.reload();
			} else {
				toast.error(`${result.data.message}`);
			}
		} catch (error) {
			toast.error(`Erreur dans la suppression du type de transport: ${name}`);
		}
	};

	return (
		<div>
			<h2>Gestion des catégories</h2>
			<div className="create-user">
				<div className="create-user-header">
					<h3>Types de transports</h3>
					{needRefresh && (
						<FontAwesomeIcon
							icon={faRefresh}
							className="refresh-icon"
							onClick={refreshPage}
						/>
					)}
				</div>

				<form data-test-id="manage-tags" onSubmit={createTransportation}>
					<div>
						{/* Type of transporation */}
						<label className="tags-label">Type de transport:</label>

						<Input
							faIcon={faShip}
							placeholderText="Type de transport"
							value={newTransportation}
							data-testid="transportation"
							onChange={(event) => setNewTransportation(event.target.value)}
							type="text"
						/>
					</div>

					<div>
						{/* Carbon coefficient */}
						<label className="tags-label">Coefficient carbone</label>

						<Input
							faIcon={faSmog}
							placeholderText="Coefficient Carbone"
							value={carbonCoef}
							data-testid="carbonCoef"
							onChange={(event) => {
								if (event.target.value.length === 0) {
									setCarbonCoef("");
								} else {
									let inputValue = event.target.value;
									if (event.target.value.includes(".")) {
										// Replace comma with dot
										inputValue.replace(".", ",");
									}
									const newValue = parseFloat(inputValue);
									setCarbonCoef(newValue);
								}
							}}
							type="number"
							step="0.01"
						/>
					</div>
					<div className="button-container">
						<Button
							buttonText="Valider"
							buttonType="submit"
							disabled={typeof carbonCoef !== "number"}
						/>
					</div>
				</form>

				{/* One line per existing transportation */}
				{allTransportations &&
					allTransportations.map((item, index) => (
						<div className="transportation-line" key={index}>
							<div>
								{item.name} - coef:{item.carbonCoefficient}
							</div>
							<div className="icons-container">
								<div className="icon-container">
									<FontAwesomeIcon
										icon={faPen}
										//TODO implement modify transport coefficient (not name)
										onClick={() => console.log("modify transport for", item._id)}
									/>
								</div>
								<div
									className="icon-container"
									data-testid="delete-icon-container"
									onClick={() => deleteTransportationService(item._id, item.name)}
								>
									<FontAwesomeIcon icon={faTrash} />
								</div>
							</div>
						</div>
					))}
			</div>
			<ToastContainer position="bottom-right" autoClose={5000} />
		</div>
	);
};
export default ProductTags;

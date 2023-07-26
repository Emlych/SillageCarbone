/** Backoffice Products Tags : manage transportation, product types, companies, ...*/
import { faPen, faShip, faSmog, faTrash } from "@fortawesome/free-solid-svg-icons";
import Input from "../../components/Input";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import "./productTags.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer, toast } from "react-toastify";
import {
	createNewTransportation,
	fetchTransportations,
} from "../../services/productService";
import { Transportation } from "../../dto/TransportationDto";

const ProductTags = () => {
	// States
	const [newTransportation, setNewTransportation] = useState("");
	const [carbonCoef, setCarbonCoef] = useState(1);
	const [allTransportations, setAllTransportations] = useState<Transportation[] | null>(
		null
	);

	/** Initialize form */
	const initForm = () => {
		setNewTransportation("");
		setCarbonCoef(1);
	};

	/** Create transportation */
	const createTransportation = async (event: React.FormEvent) => {
		event.preventDefault();

		const fetchData = async () => {
			try {
				createNewTransportation(newTransportation, carbonCoef);
				toast(`Transport ${newTransportation}  créé `);
				initForm();
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

	return (
		<div>
			<h2>Gestion des catégories</h2>
			<div className="create-user">
				<h3>Types de transports</h3>

				<form data-test-id="manage-tags" onSubmit={createTransportation}>
					<div className="">
						{/* Filter by user name */}
						<div className="tags-label">Type de transport:</div>

						<Input
							faIcon={faShip}
							placeholderText="Type de transport"
							value={newTransportation}
							data-testid="transportation"
							onChange={(event) => setNewTransportation(event.target.value)}
							type="text"
						/>
					</div>
					<div className="">
						{/* Filter by user name */}
						<div className="tags-label">Coefficient carbone</div>

						<Input
							faIcon={faSmog}
							placeholderText="Coefficient Carbone"
							value={carbonCoef}
							data-testid="carbonCoef"
							onChange={(event) => setCarbonCoef(Number(event.target.value))}
							type="number"
						/>
					</div>
					<div className="button-container">
						<Button buttonText="Valider" buttonType="submit" />
					</div>
				</form>

				{/* One line per existing transportation */}
				{allTransportations &&
					allTransportations.map((item, index) => (
						<div className="transportation-line">
							<div>
								{item.name} - coef:{item.carbonCoefficient}
							</div>
							<div className="icons-container">
								<div className="icon-container">
									<FontAwesomeIcon
										icon={faPen}
										onClick={() => console.log("modify transport for", item._id)}
									/>
								</div>
								<div className="icon-container">
									<FontAwesomeIcon
										icon={faTrash}
										onClick={() => console.log("delete transport", item._id)}
									/>
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

/** Backoffice Products Tags : manage transportation, product types, companies, ...*/

import { faPen, faShip, faSmog, faTrash } from "@fortawesome/free-solid-svg-icons";
import Input from "../../components/Input";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import "./productTags.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

type Transportation = {
	_id: string;
	name: string;
	carbonCoefficient: number;
};

const ProductTags = () => {
	// Transportation
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

		const url = "http://localhost:8000/product/transportation/create";

		const fetchData = async () => {
			try {
				if (!newTransportation || !carbonCoef) {
					throw new Error("Missing field");
				}
				// send product to server
				const response = await axios.post(url, {
					transportation: newTransportation,
					carbonCoefficient: carbonCoef,
				});

				if (response.data) {
					alert("Le transport a été créé.");
					initForm();
				}
			} catch (error) {
				alert("Product transportation creation failed");
				console.error(error);
			}
		};
		fetchData();
	};

	/** Retrieve all transportations on page load*/
	useEffect(() => {
		const fetchAndFilterProductsData = async () => {
			try {
				const url = "http://localhost:8000/transportations";

				console.log("fetch data please here ", url);

				const response = await axios.get(url);
				console.log("response ", response.data);

				if (!response.data?.transportations) {
					throw new Error("No transportations retrieved");
				}

				setAllTransportations(response.data.transportations);
			} catch (error) {
				console.error("Error ", error);
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
		</div>
	);
};
export default ProductTags;

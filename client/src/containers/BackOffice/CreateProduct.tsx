import { useRef, useState } from "react";
import {
	faBoxOpen,
	faCommentDots,
	faLocationDot,
	faShip,
	faTag,
	faWarehouse,
} from "@fortawesome/free-solid-svg-icons";
import "../../styling/backoffice.css";
import Button from "../../components/Button";
import Input from "../../components/Input";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dropdown, { DropdownProps } from "../../components/Dropdown";

export enum TransportationType {
	Container = "container",
	Sailing = "sailing",
}

const CreateProduct = () => {
	/** Product data */
	const [name, setName] = useState("");
	const [company, setCompany] = useState("");
	const [type, setType] = useState("");
	const [description, setDescription] = useState("");
	const [originHarbour, setOriginHarbour] = useState("");
	const [destinationHarbour, setDestinationHarbour] = useState("");
	const [transportation, setTransportation] = useState(TransportationType.Container);

	/** Error message */
	const [errorMessage, setErrorMessage] = useState("");

	/** On form submission, send user data to server */
	const handleFormSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		const url = "http://localhost:8000/product/create";

		const fetchData = async () => {
			try {
				if (
					!name ||
					!company ||
					!type ||
					!originHarbour ||
					!destinationHarbour ||
					!transportation
				) {
					throw new Error("Missing field");
				}
				// send product to server
				const response = await axios.post(url, {
					name,
					company,
					type,
					originHarbour,
					destinationHarbour,
					transportation,
					description,
				});
				console.log("response ==> ", response.data);

				if (response.data) {
					alert("Le product a été créé.");
					initForm();
				}
			} catch (error) {
				alert("Product creation failed");
				console.error(error);
			}
		};
		fetchData();
	};

	/** Initialize form */
	const initForm = () => {
		setName("");
		setCompany("");
		setType("");
		setDescription("");
		setOriginHarbour("");
		setDestinationHarbour("");
		setTransportation(TransportationType.Container);
	};

	// Enable closing dropdown on clicking outside of dropdown
	const dropdownRef = useRef<HTMLDivElement>(null);
	const [showDropdown, setShowDropdown] = useState(false);
	const handleDropdownClose = (event: React.MouseEvent<HTMLDivElement>) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
			setShowDropdown(false);
		}
	};

	// User Roles are created of UserType enum
	const transports = new Map<TransportationType, TransportationType>();
	Object.values(TransportationType).forEach((value) => {
		transports.set(value, value);
	});
	const MapContentTransportationProps: DropdownProps<TransportationType> = {
		options: transports,
		handleSelectInput: (transportation: TransportationType) => {
			setTransportation(transportation);
			setShowDropdown(false);
		},
	};

	return (
		<div onClick={handleDropdownClose}>
			<h2>Créer un nouveau produit</h2>

			<form
				data-testid="addProduct-form"
				onSubmit={handleFormSubmit}
				className="create-product"
			>
				<Input
					faIcon={faBoxOpen}
					placeholderText="Nom du produit"
					value={name}
					data-testid="name"
					onChange={(event) => {
						setName(event.target.value);
					}}
					type="text"
				/>
				<Input
					faIcon={faWarehouse}
					placeholderText="Marque"
					value={company}
					data-testid="company"
					onChange={(event) => {
						setCompany(event.target.value);
					}}
					type="text"
				/>

				<Input
					faIcon={faTag}
					placeholderText="Type de produit"
					value={type}
					data-testid="type"
					onChange={(event) => {
						setType(event.target.value);
					}}
					type="text"
				/>

				<Input
					faIcon={faLocationDot}
					placeholderText="Port d'origine"
					value={originHarbour}
					data-testid="port-origine"
					onChange={(event) => {
						setOriginHarbour(event.target.value);
					}}
					type="text"
				/>
				<Input
					faIcon={faLocationDot}
					placeholderText="Port d'arrivée"
					value={destinationHarbour}
					data-testid="port-arrivee"
					onChange={(event) => {
						setDestinationHarbour(event.target.value);
					}}
					type="text"
				/>

				<div
					className="custom-input"
					ref={dropdownRef}
					onClick={() => setShowDropdown(!showDropdown)}
				>
					<label>
						<FontAwesomeIcon icon={faShip} />
					</label>

					{showDropdown && (
						<Dropdown<TransportationType> {...MapContentTransportationProps} />
					)}

					<div>{transportation}</div>
				</div>
				{/* <Input
					faIcon={faShip}
					placeholderText="Type de transport"
					value={transportation}
					data-testid="port-arrivee"
					onChange={(event) => {
						setTransportation(event.target.value);
					}}
					type="text"
				/> */}
				<Input
					faIcon={faCommentDots}
					placeholderText="Description"
					value={description}
					data-testid="description"
					onChange={(event) => {
						setDescription(event.target.value);
					}}
					type="text"
				/>

				{/* Set error message if wrong password: depends on */}
				<div className="warning">{errorMessage}</div>

				<div className="button-container">
					<Button buttonText="Valider" buttonType="submit" />
				</div>
			</form>
		</div>
	);
};
export default CreateProduct;

import { useEffect, useRef, useState } from "react";
import {
	faBoxOpen,
	faCommentDots,
	faLocationDot,
	faShip,
	faTag,
	faWarehouse,
} from "@fortawesome/free-solid-svg-icons";
import "../../pages/backoffice.css";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dropdown, { DropdownProps } from "../../components/Dropdown";
import { ToastContainer, toast } from "react-toastify";
import { createProduct, fetchTransportations } from "../../services/productService";

const CreateProduct = () => {
	/** Product data */
	const [name, setName] = useState("");
	const [company, setCompany] = useState("");
	const [type, setType] = useState("");
	const [description, setDescription] = useState("");
	const [originCity, setOriginCity] = useState("");
	const [originCountry, setOriginCountry] = useState("");
	const [destinationCity, setDestinationCity] = useState("");
	const [destinationCountry, setDestinationCountry] = useState("");
	const [picture, setPicture] = useState<File>();
	const [transportation, setTransportation] = useState("");
	const [dropdownTransport, setDropdownTransport] = useState<Map<string, string>>();

	/** On form submission, send user data to server */
	const handleFormSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		const fetchData = async () => {
			try {
				const result = await createProduct(
					name,
					company,
					type,
					originCity,
					originCountry,
					destinationCity,
					destinationCountry,
					transportation,
					description,
					picture
				);

				if (result.success) {
					const { name, company } = result.data;
					toast(`Création du produit ${name} - ${company}`);
					initForm();
				} else {
					throw new Error("Product could not be created");
				}
			} catch (error) {
				toast.error(`Erreur dans la création du produit`);
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
		setOriginCity("");
		setOriginCountry("");
		setDestinationCity("");
		setDestinationCountry("");
		setTransportation("");
	};

	// Enable closing dropdown on clicking outside of dropdown
	const dropdownRef = useRef<HTMLDivElement>(null);
	const [showDropdown, setShowDropdown] = useState(false);
	const handleDropdownClose = (event: React.MouseEvent<HTMLDivElement>) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
			setShowDropdown(false);
		}
	};

	/** Retrieve all transportations on page load*/
	useEffect(() => {
		const fetchAndFilterProductsData = async () => {
			try {
				const allTransportations = await fetchTransportations();
				const transports = new Map<string, string>();
				for (const transportation of allTransportations) {
					transports.set(transportation.name, transportation.name);
				}
				setDropdownTransport(transports);
			} catch (error) {
				toast.error(`Erreur dans l'extraction des moyens de transport`);
			}
		};
		fetchAndFilterProductsData();
	}, []);

	/** Fill dropdown props with options and behaviour when input is selected */
	const MapContentTransportationProps: DropdownProps<string> = {
		options: dropdownTransport ?? null,
		handleSelectInput: (transportation: string) => {
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

				<div className="product-form">
					<Input
						faIcon={faLocationDot}
						placeholderText="Ville d'origine"
						value={originCity}
						data-testid="port-ville-origine"
						onChange={(event) => {
							setOriginCity(event.target.value);
						}}
						type="text"
					/>
					<Input
						faIcon={faLocationDot}
						placeholderText="Pays d'origine"
						value={originCountry}
						data-testid="port-pays-origine"
						onChange={(event) => {
							setOriginCountry(event.target.value);
						}}
						type="text"
					/>
				</div>

				<div className="product-form">
					<Input
						faIcon={faLocationDot}
						placeholderText="Ville d'arrivée"
						value={destinationCity}
						data-testid="port-ville-arrivee"
						onChange={(event) => {
							setDestinationCity(event.target.value);
						}}
						type="text"
					/>
					<Input
						faIcon={faLocationDot}
						placeholderText="Pays d'arrivée"
						value={destinationCountry}
						data-testid="port-pays-arrivee"
						onChange={(event) => {
							setDestinationCountry(event.target.value);
						}}
						type="text"
					/>
				</div>

				<div
					className="select-transportation-input"
					ref={dropdownRef}
					onClick={() => setShowDropdown(!showDropdown)}
				>
					<label>
						<FontAwesomeIcon icon={faShip} />
					</label>
					<div>
						{showDropdown && <Dropdown<string> {...MapContentTransportationProps} />}
					</div>

					<div>{transportation}</div>
				</div>

				<label htmlFor="file" className="">
					+ Ajouter une photo
				</label>
				<input
					type="file"
					name="file"
					id="file"
					onChange={(event) => {
						if (event.target.files) {
							setPicture(event.target.files[0]);
						}
					}}
				/>

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

				<div className="button-container">
					<Button buttonText="Valider" buttonType="submit" />
				</div>

				<ToastContainer position="bottom-right" autoClose={5000} />
			</form>
		</div>
	);
};
export default CreateProduct;

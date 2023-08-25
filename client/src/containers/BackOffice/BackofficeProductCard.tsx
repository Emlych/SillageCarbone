import Button from "../../components/Button";
import CardItem from "../../components/CardItem";
import "./backofficeProductCard.css";
import { capitalizeFirstLetter } from "../../utils/format-data-utils";
import { faBoxOpen, faTag, faWarehouse } from "@fortawesome/free-solid-svg-icons";

interface BackofficeProductCardProps {
	_id: string;
	product_name: string;
	company: string;
	co2: number;
	actionType: "archive" | "delete";
	openConfirmActionModal: (
		_id: string,
		actionType: "archive" | "delete" | "unarchive"
	) => void;
}

/** BackOffice ProductCard container */
const BackofficeProductCard = ({
	_id,
	product_name,
	company,
	co2,
	actionType,
	openConfirmActionModal,
}: BackofficeProductCardProps) => {
	// Capitalize the first letters of product name and company
	const productName = capitalizeFirstLetter(product_name);
	const productCompany = capitalizeFirstLetter(company);

	return (
		<div className="backofficeProductCard">
			<CardItem text={productName} faIcon={faBoxOpen} />
			<CardItem text={productCompany} faIcon={faWarehouse} />
			<CardItem text={`${co2} eq CO2`} faIcon={faTag} />
			<div className="usercard-button">
				{/* If the action type is "delete", show "Désarchiver" button */}
				{actionType === "delete" && (
					<Button
						buttonText="Désarchiver"
						buttonType="button"
						callback={() => openConfirmActionModal(_id, "unarchive")}
					/>
				)}
				{/* Display "Archiver" or "Supprimer" button based on action type */}
				<Button
					buttonText={actionType === "archive" ? "Archiver" : "Supprimer"}
					buttonType="button"
					callback={() => openConfirmActionModal(_id, actionType)}
					alert
				/>
			</div>
		</div>
	);
};

export default BackofficeProductCard;

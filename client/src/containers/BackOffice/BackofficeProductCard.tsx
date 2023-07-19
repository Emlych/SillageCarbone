/** BackOffice ProductCard container */
import Button from "../../components/Button";
import CardItem from "../../components/CardItem";
import "../../styling/backofficeProductCard.css";
import { capitalizeFirstLetter } from "../../utils/format-data-utils";
import { faBoxOpen, faTag } from "@fortawesome/free-solid-svg-icons";

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

const BackofficeProductCard = ({
	_id,
	product_name,
	company,
	co2,
	actionType,
	openConfirmActionModal,
}: BackofficeProductCardProps) => {
	const productName = capitalizeFirstLetter(product_name);
	const productCompany = capitalizeFirstLetter(company);
	return (
		<div className="backofficeProductCard">
			<CardItem text={productName} faIcon={faBoxOpen} />
			<CardItem text={productCompany} faIcon={faTag} />
			<CardItem text={`${co2} eq CO2`} faIcon={faTag} />
			<div className="usercard-button">
				{actionType === "delete" && (
					<Button
						buttonText="Désarchiver"
						buttonType="button"
						callback={() => openConfirmActionModal(_id, "unarchive")}
					/>
				)}
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

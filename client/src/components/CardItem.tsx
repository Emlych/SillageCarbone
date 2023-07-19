import { capitalizeFirstLetter } from "../utils/format-data-utils";
import "./carditem.css";
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";

type CardItemProps = {
	text: string;
	faIcon: FontAwesomeIconProps["icon"];
};

/** Custom CardItem component  */
const CardItem = ({ text, faIcon }: CardItemProps) => {
	return (
		<div className="carditem" data-testid="card-item">
			<FontAwesomeIcon icon={faIcon} className="carditem-icon" />
			<p>{capitalizeFirstLetter(text)}</p>
		</div>
	);
};

export default CardItem;

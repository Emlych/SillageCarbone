/** UserCard container */
import { formatDate } from "../../utils/format-data-utils";
import Button from "../Button";
import "./usercard.css";

interface UserCardProps {
	mail: string;
	creation_date: Date;
	openDeleteAccountModal: (mail: string) => void;
}

const UserCard = ({ mail, creation_date, openDeleteAccountModal }: UserCardProps) => {
	// -- Convert creation_date from format 2023-07-14T18:29:18.557Z to dd-mm-yyyy
	const convertDateFormat = formatDate(new Date(creation_date), "dd-mm-yyyy");

	return (
		<div className="usercard" data-testid="user-card">
			<div id="user-mail" data-testid="user-card-mail">
				{mail}
			</div>
			<div id="user-creation-date">Créé le: {convertDateFormat}</div>
			<div className="usercard-button">
				<Button
					buttonText="Supprimer"
					buttonType="button"
					callback={() => openDeleteAccountModal(mail)} // Pass the mail and MouseEvent object to the callback function
				/>
			</div>
		</div>
	);
};

export default UserCard;

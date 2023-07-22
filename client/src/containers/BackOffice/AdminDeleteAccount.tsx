import { faLock } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import axios from "axios";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Cookies from "js-cookie";

export type AdminDeleteAccountProps = {
	toggleModal: Function;
	mail: string; //mail of account to delete
};
const AdminDeleteAccount = ({ toggleModal, mail }: AdminDeleteAccountProps) => {
	/** On form submission, delete account */
	const handleFormSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		const url = "http://localhost:8000/user/admin/delete";

		const fetchData = async () => {
			try {
				// -- No mail registered (needs to be investigated)
				if (!mail) {
					throw new Error("Missing user");
				}

				// -- Is user connected as admin
				const adminToken = Cookies.get("adminToken");
				if (!adminToken) {
					throw new Error("Not authorized to access list of users.");
				}

				// -- Send delete request
				const response = await axios.delete(url, {
					headers: { authorization: `Bearer ${adminToken}` },
					data: { mail },
				});

				if (response.data) {
					// -- Close modal
					toggleModal();
					alert("Compte supprimé");
					window.location.reload();
				}
			} catch (error) {
				console.error(error);
				alert("User could not be deleted.");
			}
		};
		fetchData();
	};

	const confirmMessage = "Je veux supprimer ce compte.";
	const [copyConfirmMessage, setCopyConfirmMessage] = useState("");

	/** Check copied confirm message is the same as confirm message */
	const sameConfirmMessage = (copyConfirmMessage: string): boolean => {
		return copyConfirmMessage === confirmMessage;
	};

	return (
		<form
			data-testid="change-password-form"
			onSubmit={handleFormSubmit}
			className="change-password"
		>
			<h2>Suppression du compte</h2>
			<p>Confirmer la suppression en recopiant ce message: "{confirmMessage}"</p>

			<div className="modal-password-input">
				<Input
					faIcon={faLock}
					placeholderText=""
					value={copyConfirmMessage}
					data-testid="confirm-message"
					onChange={(event) => setCopyConfirmMessage(event?.target.value)}
					type="text"
				/>
			</div>

			<div className="account-button-container">
				<Button buttonText="Annuler" buttonType="button" callback={() => toggleModal()} />
				<Button
					buttonText="Supprimer définitivement ce compte"
					buttonType="submit"
					disabled={!sameConfirmMessage(copyConfirmMessage)}
					alert
				/>
			</div>
		</form>
	);
};

export default AdminDeleteAccount;

import { faLock } from "@fortawesome/free-solid-svg-icons";
import { deleteUserAsAdmin } from "../../services/userService";
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";

export type AdminDeleteAccountProps = {
	toggleModal: Function;
	mail: string; //mail of account to delete
};
const AdminDeleteAccount = ({ toggleModal, mail }: AdminDeleteAccountProps) => {
	/** On form submission, delete account */
	const handleFormSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		const fetchData = async () => {
			try {
				await deleteUserAsAdmin(mail).then(() => {
					// -- Close modal
					toggleModal();
					toast("Compte supprimé");
					window.location.reload();
				});
			} catch (error) {
				toast.error("Le compte n'a pas pu être supprimé");
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
			data-testid="admin-delete-account-form"
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

			{/* Toast to display error message */}
			<ToastContainer position="bottom-right" autoClose={5000} />
		</form>
	);
};

export default AdminDeleteAccount;

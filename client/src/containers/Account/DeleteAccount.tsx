import { faEye, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { deleteToken } from "../../utils/token-utils";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "../../services/userService";
import { ToastContainer, toast } from "react-toastify";
import Input from "../../components/Input";
import Button from "../../components/Button";

export type DeleteAccountProps = {
	toggleModal: Function;
};

const DeleteAccount = ({ toggleModal }: DeleteAccountProps) => {
	const [password, setPassword] = useState("");
	const [hiddenPassword, setHiddenPassword] = useState(true);

	const navigate = useNavigate();

	const handleFormSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		const fetchData = async () => {
			try {
				await deleteUser(password).then(() => {
					// -- Delete userMailToken and userToken
					deleteToken();
					// -- Navigate to home page
					navigate("/");
				});
			} catch (error) {
				toast.error("Le compte n'a pas pu être supprimé");
			}
		};
		fetchData();
	};

	return (
		<form
			data-testid="change-password-form"
			onSubmit={handleFormSubmit}
			className="change-password"
		>
			<h2>Supprimer mon compte</h2>
			<p>
				Vous êtes sur le point de supprimer votre compte. Vos données personnelles seront
				définitivement perdues. Confirmez-vous la suppression de ce compte ?
			</p>

			<p className="modal-message">Pourquoi supprimez-vous votre compte?</p>
			<select name="deletion-reason" id="deletion-reason" className="deletion-select">
				<option value="no-use">Je n'en ai plus l'utilité.</option>
				<option value="not-reassured">
					Je suis inquiété par l'utilisation de mes données personnelles.
				</option>
				<option value="other">Autre</option>
			</select>

			<p className="modal-message">
				Veuillez confirmer votre mot de passe avant de continuer :
			</p>
			<div className="modal-password-input">
				<FontAwesomeIcon
					icon={faEye}
					onClick={() => setHiddenPassword(!hiddenPassword)}
					data-testid="eye-icon"
					className="password-eye-icon"
				/>
				<Input
					faIcon={faLock}
					placeholderText=""
					value={password}
					data-testid="password"
					onChange={(event) => setPassword(event?.target.value)}
					type={hiddenPassword ? "password" : "text"}
				/>
			</div>

			<div className="account-button-container">
				<Button buttonText="Annuler" buttonType="button" callback={() => toggleModal()} />
				<Button
					buttonText="Supprimer définitivement mon compte"
					buttonType="submit"
					alert
				/>
			</div>

			{/* Toast to display error message */}
			<ToastContainer position="bottom-right" autoClose={5000} />
		</form>
	);
};

export default DeleteAccount;

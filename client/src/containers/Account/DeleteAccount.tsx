import { faEye, faLock } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";
import axios from "axios";
import { deleteToken } from "../../utils/data-utils";
import { useNavigate } from "react-router-dom";

export type DeleteAccountProps = {
	toggleModal: Function;
};
const DeleteAccount = ({ toggleModal }: DeleteAccountProps) => {
	const [password, setPassword] = useState("");
	const [hiddenPassword, setHiddenPassword] = useState(true);

	// -- Retrieve user mail using cookie token
	const userMail = Cookies.get("userMailToken");

	const navigate = useNavigate();

	const handleFormSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		const url = "http://localhost:8000/user/delete";

		const fetchData = async () => {
			try {
				// -- No mail registered (needs to be investigated)
				if (!userMail) {
					throw new Error("Missing user");
				}
				// -- Check all fields were provided
				if (!password) {
					throw new Error("Missing field");
				}
				// -- Send delete request
				const response = await axios.delete(url, { data: { mail: userMail, password } });

				if (response.data) {
					// -- Delete userMailToken and userToken
					deleteToken();

					// -- Navigate
					navigate("/");
					alert("Votre compte a été supprimé");
				}
			} catch (error) {
				console.error(error);
				alert("User could not be deleted.");
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
		</form>
	);
};

export default DeleteAccount;

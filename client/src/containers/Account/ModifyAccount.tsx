import { faEye, faLock, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { updateUser } from "../../services/userService";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { isFormCorrect } from "../../utils/format-data-utils";
import { createToken } from "../../utils/token-utils";

const ModifyPassword = () => {
	const [actualPassword, setActualPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmNewPassword, setConfirmNewPassword] = useState("");

	const [hiddenActualPassword, setHiddenActualPassword] = useState(true);
	const [hiddenNewPassword, setHiddenNewPassword] = useState(true);
	const [hiddenConfirmPassword, setHiddenConfirmPassword] = useState(true);

	const [errorMessage, setErrorMessage] = useState("");

	// -- When password has been changed, validRequest will be passed to true
	const [validRequest, setValidRequest] = useState(false);

	/** On form submission, send actual and new password to server */
	const handleFormSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		const fetchData = async () => {
			try {
				updateUser(actualPassword, newPassword).then((userData) => {
					setValidRequest(true);
					createToken(userData.token, userData.mail, false);
				});
			} catch (error: any) {
				alert("User password could not be changed.");
				throw new Error("Could not modify password");
			}
		};

		// -- Fetch data only if form is correct (avoid unecessary operations server side)
		const canSubmit = isFormCorrect(
			newPassword,
			confirmNewPassword,
			undefined,
			actualPassword
		);
		if (canSubmit.isCorrect) {
			fetchData();
		} else {
			setErrorMessage(canSubmit.errorMessage);
		}
	};

	return (
		<div>
			<h2>Changer de mot de passe</h2>
			{validRequest ? (
				<div>Votre mot de passe a été modifié.</div>
			) : (
				<form
					data-testid="change-password-form"
					onSubmit={handleFormSubmit}
					className="change-password"
				>
					<p className="modal-message">Mot de passe actuel : </p>
					<div className="modal-password-input">
						<FontAwesomeIcon
							icon={hiddenActualPassword ? faEye : faEyeSlash}
							onClick={() => setHiddenActualPassword(!hiddenActualPassword)}
							data-testid="eye-icon"
							className="password-eye-icon"
						/>
						<Input
							faIcon={faLock}
							placeholderText=""
							value={actualPassword}
							data-testid="actual-password"
							onChange={(event) => setActualPassword(event?.target.value)}
							type={hiddenActualPassword ? "password" : "text"}
						/>
					</div>

					<p className="modal-message">Nouveau mot de passe : </p>
					<div className="modal-password-input">
						<FontAwesomeIcon
							icon={hiddenNewPassword ? faEye : faEyeSlash}
							onClick={() => setHiddenNewPassword(!hiddenNewPassword)}
							data-testid="eye-icon"
							className="password-eye-icon"
						/>
						<Input
							faIcon={faLock}
							placeholderText=""
							value={newPassword}
							data-testid="actual-password"
							onChange={(event) => setNewPassword(event?.target.value)}
							type={hiddenNewPassword ? "password" : "text"}
						/>
					</div>

					<p className="modal-message">Confirmer le nouveau mot de passe : </p>
					<div className="modal-password-input">
						<FontAwesomeIcon
							icon={hiddenConfirmPassword ? faEye : faEyeSlash}
							onClick={() => setHiddenConfirmPassword(!hiddenConfirmPassword)}
							data-testid="eye-icon"
							className="password-eye-icon"
						/>
						<Input
							faIcon={faLock}
							placeholderText=""
							value={confirmNewPassword}
							data-testid="actual-password"
							onChange={(event) => setConfirmNewPassword(event?.target.value)}
							type={hiddenConfirmPassword ? "password" : "text"}
						/>
					</div>
					{/* Set error message  */}
					<p className="warning">{errorMessage}</p>

					<Button buttonText="Modifier le mot de passe" buttonType="submit" />
				</form>
			)}
		</div>
	);
};

export default ModifyPassword;

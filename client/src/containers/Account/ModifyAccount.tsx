import { faEye, faLock } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Cookies from "js-cookie";

const ModifyPassword = () => {
	const [actualPassword, setActualPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmNewPassword, setConfirmNewPassword] = useState("");

	const [hiddenActualPassword, setHiddenActualPassword] = useState(true);
	const [hiddenNewPassword, setHiddenNewPassword] = useState(true);
	const [hiddenConfirmPassword, setHiddenConfirmPassword] = useState(true);

	// -- When password has been changed, validRequest will be passed to true
	const [validRequest, setValidRequest] = useState(false);

	// -- Retrieve user mail using cookie token
	const userMail = Cookies.get("userMailToken");

	const handleFormSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		const url = "http://localhost:8000/user/change-password";
		const fetchData = async () => {
			try {
				// -- No mail registered (needs to be investigated)
				if (!userMail) {
					throw new Error("Missing user");
				}
				// -- Check all fields were provided
				if (!actualPassword || !newPassword) {
					throw new Error("Missing field");
				}
				// -- Send update request
				const response = await axios.put(url, {
					mail: userMail,
					password: actualPassword,
					newPassword,
				});

				if (response.data) {
					setValidRequest(true);
				}

				// -- Need to display an "okay message"
			} catch (error: any) {
				alert("User password could not be changed.");
				throw new Error("Could not modify password");
			}
		};
		fetchData();
	};

	/** Return true if password and password to confirm are the same */
	const comparePasswords = (password: string, confirmPassword: string): boolean => {
		return password === confirmPassword;
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
							icon={faEye}
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
							icon={faEye}
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
							icon={faEye}
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

					<Button
						buttonText="Modifier le mot de passe"
						buttonType="submit"
						disabled={
							!comparePasswords(newPassword, confirmNewPassword) &&
							actualPassword.length > 0
						}
					/>
				</form>
			)}
		</div>
	);
};

export default ModifyPassword;
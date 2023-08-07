import { faEnvelope, faEye, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { createToken } from "../../utils/data-utils";
import { createUser } from "../../services/userService";
import { isEmailFormat, isPasswordStrong } from "../../utils/format-data-utils";

type SignupProps = {
	toggleModal: Function;
	mail: string;
	setMail: Function;
	password: string;
	setPassword: Function;
	confirmPassword: string;
	setConfirmPassword: Function;
	hiddenPassword: boolean;
	setHiddenPassword: Function;
	hiddenConfirmPassword: boolean;
	setHiddenConfirmPassword: Function;
	setComponentKeyName: Function;
};

const Signup = ({
	toggleModal,
	mail,
	setMail,
	password,
	setPassword,
	confirmPassword,
	setConfirmPassword,
	hiddenPassword,
	setHiddenPassword,
	hiddenConfirmPassword,
	setHiddenConfirmPassword,
	setComponentKeyName,
}: SignupProps) => {
	/** States */
	const [errorMessage, setErrorMessage] = useState("");

	/** Handle form error: check password and mail format */
	const isFormCorrect = (): boolean => {
		if (password.length === 0 || confirmPassword.length === 0) {
			// Fields not empty - Already covered by default html5 behaviour so won't be used normally
			setErrorMessage("Veuillez fournir un mot de passe.");
			return false;
		}
		if (!isEmailFormat(mail)) {
			// Format mail respected - Already covered by default html5 behaviour so won't be used normally
			setErrorMessage("Veuillez fournir une adresse mail valide.");
			return false;
		}
		if (!isPasswordStrong(password)) {
			// Weak password
			setErrorMessage(
				"Le mot de passe est trop faible. Il doit contenir au moins 12 caractères, une majuscule, une minuscule et un chiffre"
			);
			return false;
		}
		if (!samePasswords(password, confirmPassword)) {
			// Password and confirm password should be the same
			setErrorMessage(
				"Le mot de passe à confirmer doit être identique au mot de passe fourni."
			);
			return false;
		}
		return true;
	};

	/** On form submission, send user data to server */
	const handleFormSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		const fetchData = async () => {
			try {
				createUser(mail, password).then((userData) => {
					createToken(userData.token, userData.mail, false);
					toggleModal();
				});
			} catch (error: any) {
				throw new Error("Vous n'êtes pas autorisé à vous connecter.");
			}
		};

		// -- Fetch data only if form is correct (avoid unecessary operations server side)
		if (isFormCorrect()) fetchData();
	};

	const samePasswords = (password: string, passwordToConfirm: string): boolean => {
		return password === passwordToConfirm;
	};

	return (
		<form data-testid="signup-form" onSubmit={handleFormSubmit} className="signup">
			<h2>Créer un compte</h2>

			<Input
				faIcon={faEnvelope}
				placeholderText="Adresse mail"
				value={mail}
				data-testid="mail"
				onChange={(event: ChangeEvent<HTMLInputElement>) => setMail(event.target.value)}
				type="email"
			/>

			<div className="modal-password-input">
				<FontAwesomeIcon
					icon={faEye}
					onClick={() => setHiddenPassword(!hiddenPassword)}
					data-testid="eye-icon"
					className="password-eye-icon"
				/>
				<Input
					faIcon={faLock}
					placeholderText="Mot de passe"
					value={password}
					data-testid="password"
					onChange={(event: ChangeEvent<HTMLInputElement>) =>
						setPassword(event.target.value)
					}
					type={hiddenPassword ? "password" : "text"}
				/>
			</div>

			<div className="modal-password-input">
				<FontAwesomeIcon
					icon={faEye}
					onClick={() => setHiddenConfirmPassword(!hiddenConfirmPassword)}
					data-testid="eye-icon"
					className="password-eye-icon"
				/>
				<Input
					faIcon={faLock}
					placeholderText="Confirmer le mot de passe"
					value={confirmPassword}
					data-testid="password"
					onChange={(event: ChangeEvent<HTMLInputElement>) =>
						setConfirmPassword(event.target.value)
					}
					type={hiddenConfirmPassword ? "password" : "text"}
				/>
			</div>

			{/* Set error message  */}
			<p className="warning">{errorMessage}</p>

			<Button buttonText="Créer un compte" buttonType="submit" />

			<p className="modal-navigateTo" onClick={() => setComponentKeyName("login")}>
				Si vous avez déjà un compte, se connecter.
			</p>
		</form>
	);
};

export default Signup;

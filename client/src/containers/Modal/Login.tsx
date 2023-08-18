import { faEnvelope, faEye, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { createToken } from "../../utils/token-utils";
import { UserType } from "../../dto/UserDto";
import { loginUser } from "../../services/userService";
import { ChangeEvent, useState } from "react";
import { isEmailFormat } from "../../utils/format-data-utils";

export type LoginProps = {
	toggleModal: Function;
	mail: string;
	setMail: Function;
	password: string;
	setPassword: Function;
	hiddenPassword: boolean;
	setHiddenPassword: Function;
	setComponentKeyName: Function;
};
const Login = ({
	toggleModal,
	mail,
	setMail,
	password,
	setPassword,
	hiddenPassword,
	setHiddenPassword,
	setComponentKeyName,
}: LoginProps) => {
	/** States */
	const [errorMessage, setErrorMessage] = useState("");

	/** On form submission, send user data to server */
	const handleFormSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		// Check mail format and that password is filled before fetching Data.
		if (password.length === 0) {
			// Already covered by default html5 behaviour so won't be used normally
			setErrorMessage("Veuillez fournir un mot de passe.");
			return;
		}
		if (!isEmailFormat(mail)) {
			// Already covered by default html5 behaviour so won't be used normally
			setErrorMessage("Veuillez fournir une adresse mail valide.");
			return;
		}

		const fetchData = async () => {
			try {
				const searchedUser = await loginUser(mail, password);
				const isAdmin = searchedUser.userType === UserType.Admin;
				createToken(searchedUser.token, searchedUser.mail, isAdmin);
				toggleModal();
			} catch (error) {
				setErrorMessage("Email ou mot de passe incorrect(s).");
			}
		};
		fetchData();
	};

	return (
		<form data-testid="login-form" onSubmit={handleFormSubmit} className="login">
			<h2>Connexion</h2>
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

			<p
				className="modal-message"
				onClick={() => setComponentKeyName("forgotten-password")}
			>
				Mot de passe oublié ?
			</p>

			{/* Set error message  */}
			<p className="warning">{errorMessage}</p>

			<Button buttonText="Se connecter" buttonType="submit" />
			<p className="modal-navigateTo" onClick={() => setComponentKeyName("signup")}>
				Pas de compte? Créer un compte.
			</p>
		</form>
	);
};

export default Login;

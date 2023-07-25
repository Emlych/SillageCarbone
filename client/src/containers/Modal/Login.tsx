import { faEnvelope, faEye, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { createToken } from "../../utils/data-utils";
import axios from "axios";
import { UserType } from "../../dto/UserDto";

export type LoginProps = {
	toggleModal: Function;
	mail: string;
	setMail: Function;
	password: string;
	setPassword: Function;
	hiddenPassword: boolean;
	setHiddenPassword: Function;
	errorMessage: string;
	setErrorMessage: Function;
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
	errorMessage,
	setErrorMessage,
	setComponentKeyName,
}: LoginProps) => {
	const handleMailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setMail(event.target.value);
	};
	const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value);
	};

	/** On form submission, send user data to server */
	const handleFormSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		const url = "http://localhost:8000/user/login";
		const fetchData = async () => {
			try {
				// -- Check all fields were provided
				if (!mail || !password) {
					throw new Error("Missing field");
				}
				const response = await axios.post(url, { mail, password });
				const searchedUser = response.data.searchedUser;
				if (
					searchedUser &&
					searchedUser.token &&
					searchedUser.userType &&
					searchedUser.mail
				) {
					const isAdmin = searchedUser.userType === UserType.Admin;
					createToken(searchedUser.token, searchedUser.mail, isAdmin);
					toggleModal();
				}
			} catch (error: any) {
				if (error.response.status === 400 || error.response.status === 401)
					setErrorMessage("Mauvais email/mot de passe");
				throw new Error("Unauthorized connexion");
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
				onChange={handleMailChange}
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
					onChange={handlePasswordChange}
					type={hiddenPassword ? "password" : "text"}
				/>
			</div>

			<p
				className="modal-message"
				onClick={() => setComponentKeyName("forgotten-password")}
			>
				Mot de passe oublié ?
			</p>

			{/* Set error message if wrong password: depends on */}
			<p className="warning">{errorMessage}</p>
			<Button buttonText="Se connecter" buttonType="submit" />
			<p className="modal-navigateTo" onClick={() => setComponentKeyName("signup")}>
				Pas de compte? Créer un compte.
			</p>
		</form>
	);
};

export default Login;

import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FormEventHandler } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { User, UserType } from "../../components/Modal";
import { fetchUserData } from "../../utils/data-utils";

export type ForgottenPasswordProps = {
	//handleFormSubmit: FormEventHandler<HTMLFormElement>;
	mail: string;
	setMail: Function;
};
const ForgottenPassword = ({
	//handleFormSubmit,
	mail,
	setMail,
}: ForgottenPasswordProps) => {
	const handleMailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setMail(event.target.value);
	};

	/** On form submission, send user data to server */
	const handleFormSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		const url = "http://localhost:8000/login";

		// try {
		// 	// Make API call to server
		// 	const res: User = await fetchUserData(url, mail, password);

		// 	// If positif response from server, create a token and close modal
		// 	if (res && setUser) {
		// 		const isAdmin = res.userType === UserType.admin;
		// 		setUser(res.token, res.mail, isAdmin);
		// 		toggleModal();
		// 	}
		// } catch (error) {
		// 	if (!mail || !password) {
		// 		setErrorMessage("Missing field(s).");
		// 		alert("Missing field(s)");
		// 	} else {
		// 		alert("User connexion failed");
		// 	}
		// }
	};

	return (
		<form
			data-testid="forgotten-password-form"
			onSubmit={handleFormSubmit}
			className="forgotten-password"
		>
			<h2>Mot de passe oublié</h2>
			<p className="modal-message">Veuillez fournir votre adresse mail.</p>

			<Input
				faIcon={faEnvelope}
				placeholderText="Adresse mail"
				value={mail}
				data-testid="mail"
				onChange={handleMailChange}
				type="email"
			/>
			<Button buttonText="Soumettre" buttonType="submit" />
		</form>
	);
};

export default ForgottenPassword;

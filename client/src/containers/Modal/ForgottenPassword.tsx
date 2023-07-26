import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { ChangeEvent } from "react";

export type ForgottenPasswordProps = {
	mail: string;
	setMail: Function;
};
const ForgottenPassword = ({ mail, setMail }: ForgottenPasswordProps) => {
	/** On form submission, send user data to server */
	const handleFormSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		// TODO V2
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
				onChange={(event: ChangeEvent<HTMLInputElement>) => setMail(event.target.value)}
				type="email"
			/>
			<Button buttonText="Soumettre" buttonType="submit" />
		</form>
	);
};

export default ForgottenPassword;

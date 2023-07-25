import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Input from "../../components/Input";
import Button from "../../components/Button";

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
				onChange={handleMailChange}
				type="email"
			/>
			<Button buttonText="Soumettre" buttonType="submit" />
		</form>
	);
};

export default ForgottenPassword;

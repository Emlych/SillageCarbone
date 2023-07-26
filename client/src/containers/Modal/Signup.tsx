import { faEnvelope, faEye, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useEffect, useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { createToken } from "../../utils/data-utils";
import { createUser } from "../../services/userService";

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
	errorMessage: string;
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
	errorMessage,
	setComponentKeyName,
}: SignupProps) => {
	const [canSubmit, setCanSubmit] = useState(false);

	useEffect(() => {
		setCanSubmit(confirmPassword === password);
	}, [password, confirmPassword]);

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
		fetchData();
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

			{!canSubmit && <p className="warning">{errorMessage}</p>}

			<Button buttonText="Créer un compte" buttonType="submit" disabled={!canSubmit} />

			<p className="modal-navigateTo" onClick={() => setComponentKeyName("login")}>
				Si vous avez déjà un compte, se connecter.
			</p>
		</form>
	);
};

export default Signup;

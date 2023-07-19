import { faEnvelope, faEye, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useEffect, useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { UserType } from "../../components/Modal";
import { createToken } from "../../utils/data-utils";
import axios from "axios";

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

	const handleMailChange = (event: ChangeEvent<HTMLInputElement>) => {
		setMail(event.target.value);
	};
	const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value);
	};
	const handleConfirmPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
		setConfirmPassword(event.target.value);
	};

	/** On form submission, send user data to server */
	const handleFormSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		const url = "http://localhost:8000/user/create";

		const fetchData = async () => {
			try {
				if (!mail || !password) {
					throw new Error("Missing field");
				}
				const response = await axios.post(url, { mail, password });
				if (response.data) {
					const isAdmin = response.data.userType === UserType.Admin;
					createToken(response.data.token, response.data.mail, isAdmin);
					toggleModal();
				}
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
					onChange={handleConfirmPasswordChange}
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

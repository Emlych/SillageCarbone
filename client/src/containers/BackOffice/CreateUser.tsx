import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEnvelope,
	faEye,
	faLock,
	faUserAstronaut,
} from "@fortawesome/free-solid-svg-icons";
import "../../pages/backoffice.css";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Dropdown, { DropdownProps } from "../../components/Dropdown";
import { ToastContainer, toast } from "react-toastify";
import { UserType } from "../../dto/UserDto";
import { createUser } from "../../services/userService";

const CreateUser = () => {
	/** Informations associated with account creation: mail, password and user role */
	const [mail, setMail] = useState("");
	const [password, setPassword] = useState("");
	const [hiddenPassword, setHiddenPassword] = useState(true);
	const [userRole, setUserRole] = useState(UserType.ConnectedUser);

	/** On form submission, send user data to server */
	const handleFormSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		const fetchData = async () => {
			try {
				createUser(mail, password, userRole);
				toast(`Utilisateur de type ${userRole} créé `);
			} catch (error: any) {
				toast.error(`Erreur dans la création d'un nouvel utilisateur`, {});
				throw new Error("Vous n'êtes pas autorisé à vous connecter.");
			}
		};
		fetchData();
	};

	// Enable closing dropdown on clicking outside of dropdown
	const dropdownRef = useRef<HTMLDivElement>(null);
	const [showDropdown, setShowDropdown] = useState(false);
	const handleDropdownClose = (event: React.MouseEvent<HTMLDivElement>) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
			setShowDropdown(false);
		}
	};

	// User Roles are created of UserType enum
	const userRoles = new Map<UserType, UserType>();
	Object.values(UserType).forEach((value) => {
		userRoles.set(value, value);
	});

	const MapContentUserTypeProps: DropdownProps<UserType> = {
		options: userRoles,
		handleSelectInput: (userRole: UserType) => {
			setUserRole(userRole);
			setShowDropdown(false);
		},
	};

	return (
		<div onClick={handleDropdownClose}>
			<h2>Créer un utilisateur</h2>

			<form data-testid="signin-form" onSubmit={handleFormSubmit} className="create-user">
				<Input
					faIcon={faEnvelope}
					placeholderText="Adresse mail"
					value={mail}
					data-testid="mail"
					onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
						setMail(event.target.value)
					}
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
						onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
							setPassword(event.target.value)
						}
						type={hiddenPassword ? "password" : "text"}
					/>
				</div>

				<div
					className="custom-input"
					ref={dropdownRef}
					onClick={() => setShowDropdown(!showDropdown)}
				>
					<label>
						<FontAwesomeIcon icon={faUserAstronaut} />
					</label>

					{showDropdown && <Dropdown<UserType> {...MapContentUserTypeProps} />}

					<div>
						{userRole === UserType.ConnectedUser ? "Utilisateur connecté" : "Admin"}
					</div>
				</div>

				<div className="button-container">
					<Button buttonText="Valider" buttonType="submit" />
				</div>

				<ToastContainer position="bottom-right" autoClose={5000} />
			</form>
		</div>
	);
};
export default CreateUser;

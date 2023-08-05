import "./account.css";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import Modal from "./Modal";
import { fetchUserByMail } from "../services/userService";
import { User } from "../dto/UserDto";

const Account = () => {
	// -- Retrieve user mail using cookie token
	// const userMail = Cookies.get("userMailToken");
	const [user, setUser] = useState<User[]>();
	//const [accountDate, setAccountDate] = useState("");

	// -- Change password modal
	const [changePasswordModalIsOpen, setChangePasswordModalIsOpen] = useState(false);
	// -- Delete account modal
	const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				// -- Update users
				const userData = await fetchUserByMail();
				setUser(userData.user);
				console.log("user ", userData.user);
			} catch (error) {
				// toast.error("Erreur dans la récupération des données utilisateur.");
				console.error("Error ", error);
			}
		};
		fetchUserData();
	}, []);

	return (
		<div className="account">
			<div>
				<h2>Gestion du compte</h2>
				<div className="account-container">
					<h3>Informations utilisateur</h3>
					<p>Mail user : </p>
					<label htmlFor="newsletter">Inscription à la newsletter </label>
					<input type="checkbox" name="newsletter" id="" />
					<p>Date de création du compte :</p>
				</div>
				<div className="account-container">
					<h3>Gestion du mot de passe</h3>
					<div className="button-container">
						<Button
							buttonText="Changement du mot de passe"
							buttonType="button"
							callback={() => setChangePasswordModalIsOpen(true)}
						/>
					</div>
				</div>
				<div className="account-container">
					<h3>Suppresion du compte</h3>
					<div className="button-container">
						<Button
							buttonText="Supprimer"
							buttonType="button"
							callback={() => setDeleteModalIsOpen(true)}
						/>
					</div>
				</div>
			</div>

			{/* Modal for password change */}
			{changePasswordModalIsOpen && (
				<Modal
					toggleModal={() => setChangePasswordModalIsOpen(!changePasswordModalIsOpen)}
					accountModalKey="change-password"
				/>
			)}

			{/* Modal for account deletion */}
			{deleteModalIsOpen && (
				<Modal
					toggleModal={() => setDeleteModalIsOpen(!changePasswordModalIsOpen)} //! TODO a voir s'il faut remodifier
					accountModalKey="delete-account"
				/>
			)}
		</div>
	);
};

export default Account;

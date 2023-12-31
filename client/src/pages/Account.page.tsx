import "./account.css";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Button from "../components/Button";
import Modal from "./Modal";
import { fetchUserByMail } from "../services/userService";
import { formatDateFromString } from "../utils/format-data-utils";
import Cookies from "js-cookie";

/** Account page to check data, modify password and delete account */
const Account = () => {
	// -- Retrieve user mail using cookie token
	const [userMail, setUserMail] = useState("");
	const [accountDate, setAccountDate] = useState("");

	// -- Change password modal
	const [changePasswordModalIsOpen, setChangePasswordModalIsOpen] = useState(false);
	// -- Delete account modal
	const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

	useEffect(() => {
		// Fetch user mail and creation date
		const fetchUserData = async () => {
			try {
				// -- Update users
				const userData = await fetchUserByMail();
				setUserMail(userData.mail);
				setAccountDate(userData.creation_date);
			} catch (error) {
				console.error("Error ", error);
			}
		};
		fetchUserData();
	}, []);

	/** User needs to be an admin to access to the backoffice, if not he will redirected to home page */
	return Cookies.get("userToken") ? (
		<div className="account">
			{/* Three blocks on account's information, modify password and delete account */}
			<div className="account-inside">
				<h2>Gestion du compte</h2>
				<div className="account-container">
					<h3>Informations utilisateur</h3>
					<p>Mail user : {userMail} </p>
					<label htmlFor="newsletter">Inscription à la newsletter </label>
					<input type="checkbox" name="newsletter" id="" />
					<p>
						Date de création du compte : {formatDateFromString(accountDate, "dd-mm-yyyy")}
					</p>
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
					toggleModal={() => setDeleteModalIsOpen(!deleteModalIsOpen)}
					accountModalKey="delete-account"
				/>
			)}
		</div>
	) : (
		<Navigate to="/" />
	);
};

export default Account;

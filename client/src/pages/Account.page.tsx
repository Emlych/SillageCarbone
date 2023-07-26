import "./account.css";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Button from "../components/Button";
import Modal from "./Modal";
import { fetchUserByMail } from "../services/userService";

const Account = () => {
	// -- Retrieve user mail using cookie token
	const userMail = Cookies.get("userMailToken");

	const [accountDate, setAccountDate] = useState("");

	// -- Change password modal
	const [changePasswordModalIsOpen, setChangePasswordModalIsOpen] = useState(false);
	// -- Delete account modal
	const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

	useEffect(() => {
		const fetchAccountCreationDate = async () => {
			try {
				if (!userMail) {
					throw new Error("No mail");
				}
				const creationDate = await fetchUserByMail(userMail);
				setAccountDate(creationDate);
			} catch (error: any) {
				throw new Error(error.message);
			}
		};
		fetchAccountCreationDate();
	}, []);

	return (
		<div className="account">
			<div>
				<h2>Gestion du compte</h2>
				<div className="account-container">
					<h3>Informations utilisateur</h3>
					<p>Mail user : {userMail} </p>
					<label htmlFor="newsletter">Inscription à la newsletter </label>
					<input type="checkbox" name="newsletter" id="" />
					<p>Date de création du compte : {accountDate}</p>
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
					toggleModal={() => setChangePasswordModalIsOpen(!changePasswordModalIsOpen)} //! TODO a voir s'il faut remodifier
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

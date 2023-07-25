import Button from "../components/Button";
import "./account.css";
import { useState } from "react";
import Modal from "../components/Modal";
import Cookies from "js-cookie";

const Account = () => {
	// -- Retrieve user mail using cookie token
	const userMail = Cookies.get("userMailToken");

	// -- Change password modal
	const [changePasswordModalIsOpen, setChangePasswordModalIsOpen] = useState(false);
	const openChangePasswordModal = () => {
		setChangePasswordModalIsOpen(!changePasswordModalIsOpen);
	};

	// -- Delete account modal
	const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
	const openDeleteAccountModal = () => {
		setDeleteModalIsOpen(!deleteModalIsOpen);
	};

	return (
		<div className="account">
			<div>
				<h2>Gestion du compte</h2>
				<div className="account-container">
					<h3>Informations utilisateur</h3>
					<p>Mail user : {userMail} </p>
					<label htmlFor="newsletter">Inscription à la newsletter </label>
					<input type="checkbox" name="newsletter" id="" />
					<p>Date de création du compte </p>
				</div>
				<div className="account-container">
					<h3>Gestion du mot de passe</h3>
					<div className="button-container">
						<Button
							buttonText="Changement du mot de passe"
							buttonType="button"
							callback={openChangePasswordModal}
						/>
					</div>
				</div>
				<div className="account-container">
					<h3>Suppresion du compte</h3>
					<div className="button-container">
						<Button
							buttonText="Supprimer"
							buttonType="button"
							callback={openDeleteAccountModal}
						/>
					</div>
				</div>
			</div>

			{/* Modal for password change */}
			{changePasswordModalIsOpen && (
				<Modal toggleModal={openChangePasswordModal} accountModalKey="change-password" />
			)}

			{/* Modal for account deletion */}
			{deleteModalIsOpen && (
				<Modal toggleModal={openDeleteAccountModal} accountModalKey="delete-account" />
			)}
		</div>
	);
};

export default Account;

import "./modal.css";
import { useRef, useState } from "react";
import ProductDetail from "../containers/BackOffice/ProductDetail";
import Signup from "../containers/Modal/Signup";
import Login from "../containers/Modal/Login";
import ForgottenPassword from "../containers/Modal/ForgottenPassword";
import { fetchUserData } from "../utils/data-utils";
import ModifyPassword from "../containers/Account/ModifyAccount";
import DeleteAccount from "../containers/Account/DeleteAccount";
import AdminDeleteAccount from "../containers/BackOffice/AdminDeleteAccount";
import ActionOnProduct from "../containers/BackOffice/ActionOnProduct";

export enum UserType {
	ConnectedUser = "connectedUser",
	Admin = "admin",
}

export type User = {
	id: number;
	mail: string;
	password: string;
	token: string;
	userType: UserType;
};

type ComponentKey = "signup" | "login" | "forgotten-password" | "product-detail";

type ModalProps = {
	toggleModal: Function;
	accountModalKey?:
		| "change-password"
		| "delete-account"
		| "admin-delete-account"
		| "archive-product"
		| "delete-product"
		| "unarchive-product"
		| "product-detail";
	mailToDelete?: string;
	productId?: string;
};

const Modal = ({
	toggleModal,
	accountModalKey,
	mailToDelete,
	productId,
}: ModalProps): JSX.Element => {
	/** Informations associated with login or connexion: mail, password */
	const [mail, setMail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [hiddenPassword, setHiddenPassword] = useState(true);
	const [hiddenConfirmPassword, setHiddenConfirmPassword] = useState(true);
	const [errorMessage, setErrorMessage] = useState("");

	const [componentKeyName, setComponentKeyName] = useState<ComponentKey>("login");

	const ComponentToRender = (componentKeyName: ComponentKey) => {
		if (accountModalKey) {
			if (accountModalKey === "change-password") {
				return <ModifyPassword />;
			} else if (accountModalKey === "delete-account") {
				return <DeleteAccount toggleModal={toggleModal} />;
			} else if (mailToDelete && accountModalKey === "admin-delete-account") {
				return <AdminDeleteAccount toggleModal={toggleModal} mail={mailToDelete} />;
			} else if (productId) {
				if (accountModalKey === "archive-product") {
					return (
						<ActionOnProduct
							toggleModal={toggleModal}
							_id={productId}
							actionType="archive"
						/>
					);
				} else if (accountModalKey === "delete-product") {
					return (
						<ActionOnProduct
							toggleModal={toggleModal}
							_id={productId}
							actionType="delete"
						/>
					);
				} else if (accountModalKey === "unarchive-product") {
					return (
						<ActionOnProduct
							toggleModal={toggleModal}
							_id={productId}
							actionType="unarchive"
						/>
					);
				} else if (accountModalKey === "product-detail") {
					return <ProductDetail _id={productId} />;
				}
			}
		} else {
			switch (componentKeyName) {
				case "signup":
					return (
						<Signup
							toggleModal={toggleModal}
							mail={mail}
							setMail={setMail}
							password={password}
							setPassword={setPassword}
							confirmPassword={confirmPassword}
							setConfirmPassword={setConfirmPassword}
							hiddenPassword={hiddenPassword}
							setHiddenPassword={setHiddenPassword}
							hiddenConfirmPassword={hiddenConfirmPassword}
							setHiddenConfirmPassword={setHiddenConfirmPassword}
							errorMessage={errorMessage}
							setComponentKeyName={setComponentKeyName}
						/>
					);
				case "login":
					return (
						<Login
							toggleModal={toggleModal}
							mail={mail}
							setMail={setMail}
							password={password}
							setPassword={setPassword}
							hiddenPassword={hiddenPassword}
							setHiddenPassword={setHiddenPassword}
							errorMessage={errorMessage}
							setErrorMessage={setErrorMessage}
							setComponentKeyName={setComponentKeyName}
						/>
					);
				case "forgotten-password":
					return <ForgottenPassword mail={mail} setMail={setMail} />;
				default:
					break;
			}
		}
	};

	// Enable closing modal on clicking outside of modal
	const modalRef = useRef<HTMLDivElement>(null);
	const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
			toggleModal();
		}
	};

	return (
		<div className="modal" onClick={handleBackdropClick}>
			<div className="modal__content" ref={modalRef}>
				<div className="modal__top-icons">
					<button
						className="modal__top-icon"
						onClick={() => {
							toggleModal();
						}}
					>
						&times;
					</button>
				</div>
				<div>{ComponentToRender(componentKeyName)}</div>
			</div>
		</div>
	);
};

export default Modal;
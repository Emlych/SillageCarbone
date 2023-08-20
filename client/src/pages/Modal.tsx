import "./modal.css";
import { useRef, useState } from "react";
import ProductDetail from "../containers/BackOffice/ProductDetail";
import Signup from "../containers/Modal/Signup";
import Login from "../containers/Modal/Login";
import ForgottenPassword from "../containers/Modal/ForgottenPassword";
import ModifyPassword from "../containers/Account/ModifyAccount";
import DeleteAccount from "../containers/Account/DeleteAccount";
import AdminDeleteAccount from "../containers/BackOffice/AdminDeleteAccount";

type ComponentKey = "signup" | "login" | "forgotten-password" | "product-detail";

type ModalProps = {
	toggleModal: Function;
	accountModalKey?:
		| "change-password"
		| "delete-account"
		| "admin-delete-account"
		| "product-detail";
	mailToDelete?: string;
	productId?: string;
};

export type ToggleAccountProps = {
	toggleModal: Function;
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

	const [componentKeyName, setComponentKeyName] = useState<ComponentKey>("login");

	const ComponentToRender = (componentKeyName: ComponentKey) => {
		if (accountModalKey) {
			if (accountModalKey === "change-password") {
				return <ModifyPassword toggleModal={toggleModal} />;
			} else if (accountModalKey === "delete-account") {
				return <DeleteAccount toggleModal={toggleModal} />;
			} else if (mailToDelete && accountModalKey === "admin-delete-account") {
				return <AdminDeleteAccount toggleModal={toggleModal} mail={mailToDelete} />;
			} else if (productId && accountModalKey === "product-detail") {
				return <ProductDetail _id={productId} />;
			}
		} else {
			// -- Modal dealed from Header toggleModal
			if (componentKeyName === "signup") {
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
						setComponentKeyName={setComponentKeyName}
					/>
				);
			} else if (componentKeyName === "login") {
				return (
					<Login
						toggleModal={toggleModal}
						mail={mail}
						setMail={setMail}
						password={password}
						setPassword={setPassword}
						hiddenPassword={hiddenPassword}
						setHiddenPassword={setHiddenPassword}
						setComponentKeyName={setComponentKeyName}
					/>
				);
			} else if (componentKeyName === "forgotten-password") {
				return <ForgottenPassword mail={mail} setMail={setMail} />;
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
		<div className="modal" onClick={handleBackdropClick} data-testid="modal-backdrop">
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

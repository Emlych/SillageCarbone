import "./modal.css";
import { useRef } from "react";
import ActionOnProduct, { ActionType } from "../containers/BackOffice/ActionOnProduct";

type ModalProps = {
	toggleModal: Function;
	productId: string;
	accountModalKey: "archive-product" | "delete-product" | "unarchive-product";
};

const SmallModal = ({
	toggleModal,
	accountModalKey,
	productId,
}: ModalProps): JSX.Element => {
	/** Define type of action that modal should do */
	const productActionType = (accountModalKey: string): ActionType => {
		if (accountModalKey === "archive-product") {
			return "archive";
		} else if (accountModalKey === "delete-product") {
			return "delete";
		} else if (accountModalKey === "unarchive-product") {
			return "unarchive";
		}
		//-- To avoid typing error
		return "archive";
	};

	//-- Enable closing modal on clicking outside of modal
	const modalRef = useRef<HTMLDivElement>(null);
	const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
			toggleModal();
		}
	};

	return (
		<div className="modal" onClick={handleBackdropClick}>
			<div className="small__modal__content" ref={modalRef}>
				<div className="modal__top-icons">
					<button className="modal__top-icon" onClick={() => toggleModal()}>
						&times;
					</button>
				</div>

				<ActionOnProduct
					toggleModal={toggleModal}
					_id={productId}
					actionType={productActionType(accountModalKey)}
				/>
			</div>
		</div>
	);
};

export default SmallModal;

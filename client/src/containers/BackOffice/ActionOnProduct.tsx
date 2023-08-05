import Button from "../../components/Button";
import { archiveProduct, deleteProduct } from "../../services/productService";

export type ActionType = "archive" | "delete" | "unarchive";

export type ActionOnProductProps = {
	toggleModal: Function;
	_id: string; //id of product to delete
	actionType: ActionType;
};
const ActionOnProduct = ({ toggleModal, _id, actionType }: ActionOnProductProps) => {
	/** On form submission, delete, archive or unarchive product */
	const handleFormSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		const deleteProductService = async () => {
			try {
				deleteProduct(_id).then(() => {
					// -- Close modal
					toggleModal();
					window.location.reload();
				});
			} catch (error) {
				console.error(error);
			}
		};

		const archiveProductService = async (archiveStatus: boolean) => {
			try {
				archiveProduct(_id, archiveStatus).then(() => {
					// -- Close modal
					toggleModal();
					window.location.reload();
				});
			} catch (error) {
				console.error(error);
			}
		};

		if (actionType === "archive") {
			archiveProductService(true);
		} else if (actionType === "delete") {
			deleteProductService();
		} else if (actionType === "unarchive") {
			archiveProductService(false);
		}
	};

	let title = "";
	let message = "";
	let buttonText = "";
	switch (actionType) {
		case "archive":
			title = "Archivage";
			message = "l'archivage ";
			buttonText = "Archiver";
			break;
		case "delete":
			title = "Suppression";
			message = "la suppression ";
			buttonText = "Supprimer définitivement";
			break;
		case "unarchive":
			title = "Désarchivage";
			message = "le désarchivage ";
			buttonText = "Désarchiver";
			break;
		default:
			break;
	}

	return (
		<form
			data-testid="action-product-form"
			onSubmit={handleFormSubmit}
			className="change-password"
		>
			<h2>{title} du produit</h2>
			<p>Confirmer {message} de ce produit.</p>

			<div className="account-button-container">
				<Button buttonText="Annuler" buttonType="button" callback={() => toggleModal()} />
				<Button buttonText={buttonText} buttonType="submit" alert />
			</div>
		</form>
	);
};

export default ActionOnProduct;

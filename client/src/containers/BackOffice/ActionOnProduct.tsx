import Button from "../../components/Button";
import { archiveProduct, deleteProduct } from "../../services/productService";

export type ActionType = "archive" | "delete" | "unarchive";

export type ActionOnProductProps = {
	toggleModal: Function;
	_id: string; //id of product to delete
	actionType: ActionType;
};
const ActionOnProduct = ({ toggleModal, _id, actionType }: ActionOnProductProps) => {
	/** Delete product by providing its id */
	const deleteProductService = async () => {
		try {
			await deleteProduct(_id);
		} catch (error) {
			console.error(error);
		}
	};

	/** Archive product by providing its id and archive status */
	const archiveProductService = async (archiveStatus: boolean) => {
		try {
			await archiveProduct(_id, archiveStatus);
		} catch (error) {
			console.error(error);
		}
	};

	/** On form submission, delete, archive or unarchive product */
	const handleFormSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		try {
			if (actionType === "archive") {
				archiveProductService(true);
			} else if (actionType === "delete") {
				deleteProductService();
			} else if (actionType === "unarchive") {
				archiveProductService(false);
			}

			// Close modal and refresh page
			toggleModal();
			window.location.reload();
		} catch (error) {
			console.error(error);
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

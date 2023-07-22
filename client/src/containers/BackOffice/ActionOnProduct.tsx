import axios from "axios";
import Button from "../../components/Button";
import Cookies from "js-cookie";

export type ActionOnProductProps = {
	toggleModal: Function;
	_id: string; //id of product to delete
	actionType: "archive" | "delete" | "unarchive";
};
const ActionOnProduct = ({ toggleModal, _id, actionType }: ActionOnProductProps) => {
	/** On form submission, delete, archive or unarchive product */
	const handleFormSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		const deleteProduct = async () => {
			const url = "http://localhost:8000/product/delete";
			try {
				console.info("delete please");
				// -- No id registered (needs to be investigated)
				if (!_id) {
					throw new Error("Missing product id");
				}

				// -- Is user connected as admin
				const adminToken = Cookies.get("adminToken");
				if (!adminToken) {
					throw new Error("Not authorized to access list of users.");
				}

				// -- Send delete request
				const response = await axios.delete(url, {
					headers: { authorization: `Bearer ${adminToken}` },
					data: { _id },
				});

				if (response.data) {
					// -- Close modal
					toggleModal();
					alert("Produit supprimé");
					window.location.reload();
				}
			} catch (error) {
				console.error(error);
				alert("Product could not be deleted.");
			}
		};

		const archiveProduct = async (archiveStatus: boolean) => {
			const url = "http://localhost:8000/product/archive";
			try {
				// -- No id registered (needs to be investigated)
				if (!_id) {
					throw new Error("Missing product id");
				}

				// -- Is user connected as admin
				const adminToken = Cookies.get("adminToken");
				if (!adminToken) {
					throw new Error("Not authorized to access list of users.");
				}

				// -- Send update request
				const response = await axios.put(
					url,
					{
						_id,
						archive: archiveStatus,
					},
					{ headers: { authorization: `Bearer ${adminToken}` } }
				);

				if (response.data.message) {
					// -- Close modal
					toggleModal();
					alert(response.data.message);
					window.location.reload();
				}
			} catch (error) {
				console.error(error);
				alert("Product could not be archived.");
			}
		};

		if (actionType === "archive") {
			archiveProduct(true);
		} else if (actionType === "delete") {
			deleteProduct();
		} else if (actionType === "unarchive") {
			archiveProduct(false);
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

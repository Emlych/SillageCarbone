/** Backoffice components : Users, CreateUser, Products and CreateProduct*/

//! TODO v2: add Statistiques Component
import { BackOfficeComponentKey } from "../../pages/Backoffice.page";
import Users from "./Users";
import CreateUser from "./CreateUser";
import Products from "./Products";
import CreateProduct from "./CreateProduct";
import ProductTags from "./ProductTags";

type BackofficeComponentsProps = {
	componentKey: BackOfficeComponentKey;
};
const BackofficeComponents = ({ componentKey }: BackofficeComponentsProps) => {
	// -- Render component corresponding to the one clicked on in list (Users by default)
	const renderSwitch = (componentKey: BackOfficeComponentKey) => {
		switch (componentKey) {
			case "users":
				return <Users />;
			case "create-user":
				return <CreateUser />;
			case "products":
				return <Products />;
			case "create-product":
				return <CreateProduct />;
			case "archived-products":
				return <Products archivedProducts={true} />;
			case "product-keys":
				return <ProductTags />;
			default:
				return <Users />;
		}
	};

	return <div className="backoffice-components">{renderSwitch(componentKey)}</div>;
};

export default BackofficeComponents;

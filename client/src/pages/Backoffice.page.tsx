/** Backoffice page : for admin to manage users and products */
import "../styling/backoffice.css";
import { useState } from "react";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import Navigation from "../containers/BackOffice/Backoffice_navigation";
import BackofficeComponents from "../containers/BackOffice/Backoffice_components";

export type BackOfficeComponentKey =
	| "users"
	| "create-user"
	| "products"
	| "create-product"
	| "archived-products"
	| "product-keys";

const Backoffice = () => {
	const [componentKey, setComponentKey] = useState<BackOfficeComponentKey>("users");

	/** User needs to be an admin to access to the backoffice */
	return Cookies.get("adminToken") ? (
		<div className="backoffice">
			<Navigation setComponentKey={setComponentKey} />
			<BackofficeComponents componentKey={componentKey} />
		</div>
	) : (
		<Navigate to="/" />
	);
};

export default Backoffice;

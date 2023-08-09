/** Backoffice page : for admin to manage users and products */
import "./backoffice.css";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Navigate, useLocation } from "react-router-dom";
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

	// -- Need to keep track of actual component before reloading page
	const location = useLocation();
	useEffect(() => {
		const fragmentKey = location.hash.slice(1);
		if (fragmentKey) {
			setComponentKey(fragmentKey as BackOfficeComponentKey);
		}
	}, [location.hash]);

	/** User needs to be an admin to access to the backoffice, if not he will redirected to home page */
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

import {
	faUsers,
	faUserPlus,
	faBoxOpen,
	faSquarePlus,
	faBoxArchive,
	faTags,
} from "@fortawesome/free-solid-svg-icons";
import { BackOfficeComponentKey } from "../../pages/Backoffice.page";
import SideNavigation from "../../components/SideNavigation";

type NavigationProps = {
	setComponentKey: React.Dispatch<React.SetStateAction<BackOfficeComponentKey>>;
};
const Navigation = ({ setComponentKey }: NavigationProps) => {
	/** Update url fragment identifier */
	const handleNavItemClick = (key: BackOfficeComponentKey) => {
		setComponentKey(key);
		window.location.hash = key;
	};

	// -- List of items to display in menu
	const menuItems = [
		{
			text: "Comptes utilisateurs",
			level: 1,
			onClick: () => handleNavItemClick("users"),
		},
		{
			text: "Gestion des comptes",
			level: 2,
			icon: faUsers,
			onClick: () => handleNavItemClick("users"),
		},
		{
			text: "Créer un compte",
			level: 2,
			icon: faUserPlus,
			onClick: () => handleNavItemClick("create-user"),
		},
		{
			text: "Produits",
			level: 1,
			onClick: () => handleNavItemClick("products"),
		},
		{
			text: "Gestion des produits",
			level: 2,
			icon: faBoxOpen,
			onClick: () => handleNavItemClick("products"),
		},
		{
			text: "Créer un produit",
			level: 2,
			icon: faSquarePlus,
			onClick: () => handleNavItemClick("create-product"),
		},
		{
			text: "Produits archivés",
			level: 2,
			icon: faBoxArchive,
			onClick: () => handleNavItemClick("archived-products"),
		},
		{
			text: "Gestion des catégories",
			level: 2,
			icon: faTags,
			onClick: () => handleNavItemClick("product-keys"),
		},
	];

	return <SideNavigation menuItems={menuItems} />;
};

export default Navigation;

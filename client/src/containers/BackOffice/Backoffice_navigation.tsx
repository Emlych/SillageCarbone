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
	const menuItems = [
		{
			text: "Comptes utilisateurs",
			level: 1,
			onClick: () => setComponentKey("users"),
		},
		{
			text: "Gestion des comptes",
			level: 2,
			icon: faUsers,
			onClick: () => setComponentKey("users"),
		},
		{
			text: "Créer un compte",
			level: 2,
			icon: faUserPlus,
			onClick: () => setComponentKey("create-user"),
		},
		{
			text: "Produits",
			level: 1,
			onClick: () => setComponentKey("products"),
		},
		{
			text: "Gestion des produits",
			level: 2,
			icon: faBoxOpen,
			onClick: () => setComponentKey("products"),
		},
		{
			text: "Créer un produit",
			level: 2,
			icon: faSquarePlus,
			onClick: () => setComponentKey("create-product"),
		},
		{
			text: "Produits archivés",
			level: 2,
			icon: faBoxArchive,
			onClick: () => setComponentKey("archived-products"),
		},
		{
			text: "Gestion des catégories",
			level: 2,
			icon: faTags,
			onClick: () => setComponentKey("product-keys"),
		},
	];

	return <SideNavigation menuItems={menuItems} />;
};

export default Navigation;

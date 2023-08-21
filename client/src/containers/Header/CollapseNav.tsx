import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export type BurgerConnexionProps = {
	toggleBurgerMenu: Function;
	handleDeconnexion: () => void;
};

/**  */
const CollapseNav = ({ toggleBurgerMenu, handleDeconnexion }: BurgerConnexionProps) => {
	const navigate = useNavigate();
	/** Will close the mobile menu and navigate to the path indicated */
	function closeMenuAndNavigate(path: string): void {
		toggleBurgerMenu();
		navigate(`${path}`);
	}

	return (
		<div className="collapse-nav">
			{/* With token == connected user */}
			{Cookies.get("userToken") && (
				<nav>
					<ul onClick={() => closeMenuAndNavigate("/account")}>Compte</ul>
					<ul onClick={() => closeMenuAndNavigate("/favorites")}>Favoris</ul>
					<ul
						className="link-deconnexion"
						onClick={() => {
							handleDeconnexion();
							closeMenuAndNavigate("/");
						}}
					>
						Déconnexion
					</ul>
				</nav>
			)}
			{Cookies.get("adminToken") ? <Link to={"/backoffice"}>Backoffice</Link> : <p></p>}
		</div>
	);
};

export default CollapseNav;

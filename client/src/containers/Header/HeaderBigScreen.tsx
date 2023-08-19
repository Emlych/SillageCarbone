/** Header navigation for bigger screen. */
import { Link } from "react-router-dom";
import "./header.css";
import Cookies from "js-cookie";
import { SpecificHeaderConnexionProps } from "./Header";

const HeaderBigScreen = ({
	toggleModal,
	handleDeconnexion,
}: SpecificHeaderConnexionProps) => {
	/** Retrieve existing token */
	const userToken = Cookies.get("userToken");
	const adminToken = Cookies.get("adminToken");

	return (
		<nav className="big-screen">
			<Link to={"/"}>
				<div className="sillage-carbone">SillageCarbone</div>
			</Link>

			<div id="header-center">
				{/* Depending on type of user (not connected / connected / admin) don't display the same informations */}
				{userToken && (
					<div>
						<Link to={"/account"} className="link-account">
							Compte
						</Link>
						<Link to={"/favorites"} className="link-favorites">
							Favoris
						</Link>
					</div>
				)}
				{adminToken && <Link to={"/backoffice"}>Backoffice</Link>}
			</div>

			<div id="header-right">
				{/* Deconnexion or Connexion */}
				{userToken || adminToken ? (
					<button
						className="link-deconnexion"
						onClick={() => {
							handleDeconnexion();
						}}
						data-testid="link-deconnexion"
					>
						Déconnexion
					</button>
				) : (
					<button
						className="connexion-nav"
						onClick={() => toggleModal()}
						data-testid="link-connexion"
					>
						Connexion
					</button>
				)}
			</div>
		</nav>
	);
};

export default HeaderBigScreen;

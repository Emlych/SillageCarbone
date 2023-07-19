/** Header navigation for smaller screen. Backoffice is not accessible from small screen. */

import { Link } from "react-router-dom";
import "../../styling/header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import CollapseNav from "./CollapseNav";
import Cookies from "js-cookie";

export type HeaderConnexionProps = {
	toggleModal: Function;
	handleDeconnexion: () => void;
};

const HeaderSmallScreen = ({ toggleModal, handleDeconnexion }: HeaderConnexionProps) => {
	/** Retrieve existing token */
	const userToken = Cookies.get("userToken");

	/** For smaller screens : open or close burger */
	const [openBurger, setopenBurger] = useState(false);
	const toggleBurgerMenu = () => {
		setopenBurger(!openBurger);
	};

	return (
		<header>
			<nav className="small-screen">
				<Link className="sillage-carbone" to={"/"}>
					SillageCarbone
				</Link>

				{userToken ? (
					<button className="menu-icon" onClick={toggleBurgerMenu}>
						<FontAwesomeIcon icon={!openBurger ? faBars : faXmark} />
					</button>
				) : (
					<ul className="connexion-nav" onClick={() => toggleModal()}>
						Connexion
					</ul>
				)}

				{/* Hamburger icon with dropdown component */}
				{openBurger && (
					<div className="open-burger">
						<CollapseNav
							toggleBurgerMenu={toggleBurgerMenu}
							handleDeconnexion={handleDeconnexion}
						/>
					</div>
				)}
			</nav>
		</header>
	);
};

export default HeaderSmallScreen;

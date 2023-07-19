import "../../styling/header.css";
import { deleteToken } from "../../utils/data-utils";
import HeaderBigScreen from "./HeaderBigScreen";
import HeaderSmallScreen from "./HeaderSmallScreen";

export type HeaderConnexionProps = {
	toggleModal: Function;
};

const Header = ({ toggleModal }: HeaderConnexionProps) => {
	/** Remove token to disconnect user and reload page for header to update */
	const handleDeconnexion = () => {
		deleteToken();
		window.location.reload();
	};
	return (
		<header>
			<HeaderBigScreen toggleModal={toggleModal} handleDeconnexion={handleDeconnexion} />
			<HeaderSmallScreen
				toggleModal={toggleModal}
				handleDeconnexion={handleDeconnexion}
			/>
		</header>
	);
};

export default Header;

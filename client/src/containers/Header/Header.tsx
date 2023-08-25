import { useNavigate } from "react-router-dom";
import "./header.css";
import { deleteToken } from "../../utils/token-utils";
import HeaderBigScreen from "./HeaderBigScreen";
import HeaderSmallScreen from "./HeaderSmallScreen";

export type HeaderConnexionProps = {
	toggleModal: Function;
};
export type SpecificHeaderConnexionProps = HeaderConnexionProps & {
	handleDeconnexion: () => void;
};

const Header = ({ toggleModal }: HeaderConnexionProps) => {
	const navigate = useNavigate();

	/** Remove token to disconnect user and reload page for header to update */
	const handleDeconnexion = () => {
		deleteToken();
		navigate("/");
	};
	return (
		<header>
			{/* Header for device with large screen */}
			<HeaderBigScreen toggleModal={toggleModal} handleDeconnexion={handleDeconnexion} />

			{/* Header for mobile device */}
			<HeaderSmallScreen
				toggleModal={toggleModal}
				handleDeconnexion={handleDeconnexion}
			/>
		</header>
	);
};

export default Header;

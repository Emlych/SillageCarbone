import { Link } from "react-router-dom";
import Button from "../components/Button";
import "./errorproduct.css";

const ErrorProduct = () => {
	return (
		<div className="error-page">
			<h1>404</h1>
			<h2>Erreur de navigation.</h2>
			<div>Vous semblez vous être perdu!</div>
			<div>Nous vous suggérons de retourner à votre port base.</div>

			<Link to="/">
				<Button buttonText="Retour au port base" buttonType="button" />
			</Link>
		</div>
	);
};

export default ErrorProduct;

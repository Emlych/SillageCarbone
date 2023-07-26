import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//Import Pages
import Home from "./pages/Home.page";
import Product from "./pages/Product.page";
import Backoffice from "./pages/Backoffice.page";
import Account from "./pages/Account.page";

//Import Components
import Header from "./containers/Header/Header";
import ErrorProduct from "./pages/ErrorProduct";
import Modal from "./pages/Modal";

function App() {
	/** Open or close the login modal */
	const [modalOpen, setModalOpen] = useState(false);
	const toggleModal = () => {
		setModalOpen(!modalOpen);
	};

	return (
		<div className="App">
			{/* Ensure navigation between pages*/}
			<Router>
				{/* Header with link to other pages */}
				<Header toggleModal={toggleModal} />

				{/* Modal for connexion */}
				{modalOpen ? <Modal toggleModal={toggleModal} /> : null}

				{/* Navigation to other pages */}
				<Routes>
					{/* Home page - default path */}
					<Route path="/" element={<Home />} />

					{/* Product page */}
					<Route path="/product/:_id" element={<Product />} />

					{/* Product not found page */}
					<Route path="/product/notfound" element={<ErrorProduct />} />

					{/* Back office for admin - only with admin token */}
					<Route path="/backoffice" element={<Backoffice />} />

					{/* Account for connected users - only with admin token */}
					<Route path="/account" element={<Account />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;

/** Backoffice Users Container : display all users with filter */

// To test:
// - behaviour when missing data
// - existence of element inside list
// - filter

import "../../styling/backoffice.css";
import { faHashtag, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axios from "axios";

// Components
import UserCard from "../UserCard";
import Input from "../../components/Input";
import DateInput from "../../components/DateInput";
import PageFooter from "./PageFooter";
import Modal from "../../components/Modal";
import Cookies from "js-cookie";

interface User {
	id: number;
	mail: string;
	creation_date: Date;
}
export const DEFAULT_START_DATE = new Date(2010, 9, 5);
export const DEFAULT_FINISH_DATE = new Date();

const Users = () => {
	// User data loaded
	const [isLoading, setIsLoading] = useState(true);

	// Search filter: set the filter parameters (params) of user mail, start and finish dates
	const [params, setParams] = useState({
		mail: "",
		start_date: DEFAULT_START_DATE,
		finish_date: new Date(),
	});
	const handleFilterInput = (
		event: React.ChangeEvent<HTMLInputElement>,
		type: "name" | "start-date" | "finish-date"
	) => {
		let newParams = { ...params };

		switch (type) {
			case "name":
				newParams = { ...newParams, mail: event.target.value };
				break;
			case "start-date":
				newParams = {
					...newParams,
					start_date: new Date(event.target.value),
				};
				break;
			case "finish-date":
				newParams = {
					...newParams,
					finish_date: new Date(event.target.value),
				};
				break;
			default:
				break;
		}

		setParams(newParams);
	};

	// Limit quantity of users per page
	const [page, setPage] = useState<number>(1);
	const [limitPerPage, setLimitPerPage] = useState<number>(4);
	const [maxNumberOfPages, setMaxNumberOfPages] = useState<number>(1);

	// On update of filter params, update user data to display
	const [users, setUsers] = useState<User[]>();
	useEffect(() => {
		const fetchAndFilterUsersData = async (params: {
			mail: string;
			start_date: Date | null;
			finish_date: Date | null;
		}) => {
			try {
				const url = "http://localhost:8000/users";

				const adminToken = Cookies.get("adminToken");
				if (!adminToken) {
					throw new Error("Not authorized to access list of users.");
				}

				const response = await axios.get(url, {
					headers: { authorization: `Bearer ${adminToken}` },
					params: {
						mail: params.mail,
						start_date: params.start_date,
						finish_date: params.finish_date,
						limit: limitPerPage,
						page: page,
					},
				});

				if (!response.data) {
					throw new Error("No users retrieved");
				}

				// -- Update users
				const users = response.data.users;
				setUsers(users);

				// -- Update max number of pages for footer
				const count = response.data.count;
				const maxNumberOfPages = users.length > 0 ? Math.ceil(count / limitPerPage) : 1;
				setMaxNumberOfPages(maxNumberOfPages);

				// -- Allow display of users
				setIsLoading(false);
			} catch (error) {
				console.error("Error ", error);
			}
		};
		fetchAndFilterUsersData(params);
	}, [params, page, limitPerPage]);

	// -- Delete account modal
	const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
	const [userToDeleteMail, setUserToDeleteMail] = useState("");
	const toggleDeleteModal = () => {
		setDeleteModalIsOpen(!deleteModalIsOpen);
	};
	// Open modal to delete account as admin (don't need password)
	const openDeleteAccountModal = (mail: string): void => {
		if (mail) {
			toggleDeleteModal();
			setUserToDeleteMail(mail); // Store the mail in state
		}
	};

	return (
		<div>
			<h2>Liste de tous les utilisateurs</h2>

			<p>Filtrer par : </p>

			<div className="filter">
				<div className="filter-search-name-container">
					{/* Filter by user name */}
					<label htmlFor="Search by user name" className="filter-search-name-container">
						Nom d'utilisateur:
					</label>

					<Input
						faIcon={faSearch}
						placeholderText="Recherche des utilisateurs"
						data-testid="search-word"
						onChange={(event) => handleFilterInput(event, "name")}
						type="text"
					/>
				</div>
				<div className="filter-search-name-container" id="number-input">
					{/* Filter by user name */}
					<label htmlFor="Search by user name" className="filter-search-name-container">
						Quantité par page:
					</label>

					<Input
						faIcon={faHashtag}
						placeholderText=""
						data-testid="limitPerPage"
						onChange={(event) => {
							const inputValue = Number(event.target.value);
							if (!isNaN(inputValue)) {
								setLimitPerPage(inputValue);
							}
						}}
						type="number"
					/>
				</div>

				{/* Filter by date range : start and finish date */}
				<DateInput
					type="start-date"
					value={params.start_date}
					onChange={handleFilterInput}
				/>
				<DateInput
					type="finish-date"
					value={params.finish_date}
					onChange={handleFilterInput}
				/>
			</div>

			{!isLoading && users && users.length > 0 ? (
				<div>
					<div className="users">
						{/* Filter by search bar item if not empty */}
						{users.map((user, index) => (
							<div key={index}>
								<UserCard
									mail={user.mail}
									creation_date={user.creation_date}
									openDeleteAccountModal={openDeleteAccountModal}
								/>
							</div>
						))}
					</div>

					{/* Modal for account deletion */}
					{deleteModalIsOpen && (
						<Modal
							toggleModal={toggleDeleteModal}
							accountModalKey="admin-delete-account"
							mailToDelete={userToDeleteMail}
						/>
					)}

					<PageFooter page={page} maxNumberOfPages={maxNumberOfPages} setPage={setPage} />
				</div>
			) : (
				<span>En cours de chargement...</span>
			)}
		</div>
	);
};
export default Users;

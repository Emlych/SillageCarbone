import { User } from "../components/Modal";

/** Filter users  */
export const filterAndSortUsers = (
	users: User[],
	params: { product_name: string; sort: string }
): User[] => {
	// Filter by existing product name
	let filteredData = users.filter((user) =>
		user.mail.toLowerCase().includes(params.product_name.toLowerCase())
	);

	//
	return filteredData;
};

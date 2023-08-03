import axios from "axios";
import Cookies from "js-cookie";
import { User, UserType } from "../dto/UserDto";

export const fetchUsers = async (
	mail: string,
	startDate: Date | null,
	finishDate: Date | null,
	limitPerPage: number,
	page: number
): Promise<{ users: User[]; count: number }> => {
	const url = "http://localhost:8000/users";

	try {
		const adminToken = Cookies.get("adminToken");
		if (!adminToken) {
			throw new Error("Not authorized to access list of users.");
		}

		const response = await axios.get(url, {
			headers: { authorization: `Bearer ${adminToken}` },
			params: {
				mail,
				start_date: startDate,
				finish_date: finishDate,
				limit: limitPerPage,
				page,
			},
		});
		if (!response.data) {
			throw new Error("No users retrieved");
		}

		const users = response.data.users;
		const count = response.data.count;
		return { users, count };
	} catch (error) {
		throw new Error("Error fetching users.");
	}
};

export const createUser = async (
	mail: string,
	password: string,
	userRole: UserType = UserType.ConnectedUser
): Promise<{ _id: string; mail: string; token: string }> => {
	const url = "http://localhost:8000/user/create";

	try {
		if (!mail || !password) {
			throw new Error("Missing field");
		}

		const response = await axios.post(url, { mail, password, userRole });

		if (!response.data) {
			throw new Error("User could not be created");
		}
		return response.data;
	} catch (error: any) {
		throw new Error(error.message);
	}
};

export const loginUser = async (
	mail: string,
	password: string
): Promise<{ mail: string; token: string; userType: UserType }> => {
	const url = "http://localhost:8000/user/login";

	try {
		// -- Check all fields were provided
		if (!mail || !password) {
			throw new Error("Missing field");
		}

		const response = await axios.post(url, { mail, password });
		if (!response.data) {
			throw new Error("Connexion error");
		}
		return response.data.searchedUser;
	} catch (error: any) {
		throw new Error(error.message);
	}
};

export const updateUser = async (actualPassword: string, newPassword: string) => {
	const url = "http://localhost:8000/user/change-password";

	try {
		// -- Retrieve user mail using cookie token
		const userMail = Cookies.get("userMailToken");

		// -- No mail registered (needs to be investigated)
		if (!userMail) {
			throw new Error("Missing user");
		}
		// -- Check all fields were provided
		if (!actualPassword || !newPassword) {
			throw new Error("Missing field");
		}
		// -- Is user connected as admin
		const userToken = Cookies.get("userToken");
		if (!userToken) {
			throw new Error("Not authorized.");
		}
		// -- Send update request
		const response = await axios.put(
			url,
			{
				mail: userMail,
				password: actualPassword,
				newPassword,
			},
			{ headers: { authorization: `Bearer ${userToken}` } }
		);
		if (!response.data) {
			throw new Error("User could not be created");
		}
		return response.data;
	} catch (error: any) {
		throw new Error(error.message);
	}
};

export const deleteUser = async (password: string) => {
	const url = "http://localhost:8000/user/delete";

	try {
		// -- Retrieve user mail using cookie token
		const userMail = Cookies.get("userMailToken");

		// -- No mail registered (needs to be investigated)
		if (!userMail) {
			throw new Error("Missing user");
		}
		// -- Check all fields were provided
		if (!password) {
			throw new Error("Missing field");
		}
		// -- Is user connected as admin
		const userToken = Cookies.get("userToken");
		if (!userToken) {
			throw new Error("Not authorized.");
		}
		// -- Send delete request
		const response = await axios.delete(url, {
			headers: { authorization: `Bearer ${userToken}` },
			data: { mail: userMail, password },
		});

		if (!response.data) {
			throw new Error("Could not delete account");
		}
		return response.data;
	} catch (error: any) {
		throw new Error(error.message);
	}
};

export const deleteUserAsAdmin = async (mail: string) => {
	const url = "http://localhost:8000/user/admin/delete";

	try {
		// -- No mail registered (needs to be investigated)
		if (!mail) {
			throw new Error("Missing user");
		}

		// -- Is user connected as admin
		const adminToken = Cookies.get("adminToken");
		if (!adminToken) {
			throw new Error("Not authorized to access list of users.");
		}

		// -- Send delete request
		const response = await axios.delete(url, {
			headers: { authorization: `Bearer ${adminToken}` },
			data: { mail },
		});

		if (!response.data) {
			throw new Error("Could not delete account");
		}
		return response.data;
	} catch (error: any) {
		throw new Error(error.message);
	}
};

export const fetchUserByMail = async () => {
	console.info("inside fetchUserByMail");

	const url = `http://localhost:8000/user`;
	try {
		const userMail = Cookies.get("userMailToken");
		if (!userMail) {
			throw new Error("Not authorized access to user account.");
		}
		console.info("url ", url);
		const response = await axios.get(url, { params: { userMail } });

		const searchedUser = response.data;
		if (!searchedUser) {
			throw new Error("No user found");
		}
		console.log("searcher user data ", searchedUser);

		return response.data.user; // Modify the return value to fetch the creation_date property
	} catch (error: any) {
		throw new Error(error.message);
	}
};

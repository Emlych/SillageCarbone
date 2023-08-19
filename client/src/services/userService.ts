import axios from "axios";
import Cookies from "js-cookie";
import { User, UserType } from "../dto/UserDto";

/** Backend url */
const urlBase = "https://sillage-carbone-5c169e907e77.herokuapp.com";

export const fetchUsers = async (
	mail: string,
	startDate: Date | null,
	finishDate: Date | null,
	limitPerPage: number,
	page: number
): Promise<{ users: User[]; count: number }> => {
	const url = `${urlBase}/users`;

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
	} catch (error: any) {
		throw new Error(error.message);
	}
};

export const createUser = async (
	mail: string,
	password: string,
	userRole: UserType = UserType.ConnectedUser
): Promise<{ _id: string; mail: string; token: string }> => {
	const url = `${urlBase}/user/create`;

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
	const url = `${urlBase}/user/login`;

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
	const url = `${urlBase}/user/change-password`;

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
		if (!userToken || userToken.length === 0) {
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
			throw new Error("User could not be updated");
		}
		return response.data;
	} catch (error: any) {
		throw new Error(error.message);
	}
};

export const deleteUser = async (password: string) => {
	const url = `${urlBase}/user/delete`;

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
	const url = `${urlBase}/user/admin/delete`;

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
	const url = `${urlBase}/user`;

	try {
		const userMail = Cookies.get("userMailToken");
		if (!userMail) {
			throw new Error("Not authorized access to user account.");
		}
		const response = await axios.get(url, { params: { userMail } });

		const searchedUser = response.data;
		if (!searchedUser) {
			throw new Error("No user found");
		}
		const user = response.data.user;

		return { mail: user.mail, creation_date: user.creation_date };
	} catch (error: any) {
		throw new Error(error.message);
	}
};

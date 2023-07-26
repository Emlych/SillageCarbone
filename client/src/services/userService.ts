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
	userRole: UserType
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
	} catch (error) {
		throw new Error("User could not be created");
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
		alert("User password could not be changed.");
		throw new Error("Could not modify password");
	}
};

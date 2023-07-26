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

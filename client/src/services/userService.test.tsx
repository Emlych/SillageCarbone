import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import Cookies from "js-cookie";
import {
	createUser,
	deleteUser,
	deleteUserAsAdmin,
	fetchUserByMail,
	fetchUsers,
	loginUser,
	updateUser,
} from "./userService";
import { User, UserType } from "../dto/UserDto";

const mock = new MockAdapter(axios);
const mockAdminToken = "admin-token"; // Mock the admin token value

const urlBase = "https://sillage-carbone-5c169e907e77.herokuapp.com";

beforeEach(() => {
	// -- Mock method Cookies.get to return the admin token
	Cookies.get = jest.fn().mockReturnValue(mockAdminToken);
});

afterEach(() => {
	mock.reset(); // Reset the mock after each test
});

describe("fetchUsers", () => {
	const url = `${urlBase}/users`;
	it("Fetch users successfully and return the users with count", async () => {
		const currentDate = new Date();
		const mockUsers: User[] = [
			{ id: 1, mail: "mail1@test.com", creation_date: currentDate },
			{ id: 2, mail: "mail2@test.com", creation_date: currentDate },
		];
		const mockCount = mockUsers.length;

		// Mock the response with products data and count
		mock.onGet(url).reply(200, { users: mockUsers, count: mockCount });
		const users = await fetchUsers("", null, null, 10, 1);
		// Convert Date objects to ISO string format for comparison
		const expectedUsers = mockUsers.map((user) => ({
			...user,
			creation_date: user.creation_date.toISOString(),
		}));

		expect(users).toEqual({ users: expectedUsers, count: mockCount });
	});
	it("Throw an error when no users retrieved", async () => {
		mock.onGet(url).reply(200, null);
		await expect(fetchUsers("", null, null, 10, 1)).rejects.toThrow("No users retrieved");
	});
	it("Throw an error when not authorized", async () => {
		// Mock the response with a 401 status code
		Cookies.get = jest.fn().mockReturnValue(null);
		mock.onGet(url).reply(401);
		await expect(fetchUsers("", null, null, 10, 1)).rejects.toThrow(
			"Not authorized to access list of users."
		);
	});
	it("Handle network errors and throw an error with the correct message", async () => {
		Cookies.set("adminToken", "valid_admin_token");
		mock.onGet(url).networkError();
		await expect(fetchUsers("", null, null, 10, 1)).rejects.toThrow("Network Error");
	});
});

describe("createUser", () => {
	const url = `${urlBase}/user/create`;
	it("Throw an error when required fields are missing", async () => {
		await expect(createUser("", "")).rejects.toThrow("Missing field");
	});
	it("Throw an error when user not created", async () => {
		mock.onPost(url).reply(200, null);
		await expect(createUser("User 1", "pwd1")).rejects.toThrow(
			"User could not be created"
		);
	});
	it("Handle network errors and throw an error with the correct message", async () => {
		mock.onPost(url).networkError();
		await expect(createUser("User 1", "pwd1")).rejects.toThrow("Network Error");
	});
	it("Create a user successfully and return the user info", async () => {
		const mockMail = "mail1@test.com";
		const mockUser = {
			mail: mockMail,
			password: "pwd1",
			userRole: UserType.ConnectedUser,
		};
		// Mock the response with the created product data
		mock.onPost(url).reply(200, mockUser);
		const userInfo = await createUser(mockMail, "pwd1", UserType.ConnectedUser);
		expect(userInfo).toEqual(mockUser);
	});
});

describe("loginUser", () => {
	const url = `${urlBase}/user/login`;
	it("Throw an error when required fields are missing", async () => {
		await expect(loginUser("", "")).rejects.toThrow("Missing field");
	});
	it("Throw an error when user can't connect", async () => {
		mock.onPost(url).reply(200, null);
		await expect(loginUser("User 1", "pwd1")).rejects.toThrow("Connexion error");
	});
	it("Handle network errors and throw an error with the correct message", async () => {
		mock.onPost(url).networkError();
		await expect(loginUser("User 1", "pwd1")).rejects.toThrow("Network Error");
	});
	it("Login user successfully and return user info", async () => {
		const mockUser = {
			mail: "user@test.com",
			token: "valid_token",
			userType: UserType.ConnectedUser,
		};
		// Mock the response with the logged-in user data
		mock.onPost(url).reply(200, { searchedUser: mockUser });

		const userInfo = await loginUser("user@test.com", "password123");
		const expectedResult = mockUser;
		expect(userInfo).toEqual(expectedResult);
	});
});

describe("updateUser", () => {
	const url = `${urlBase}/user/change-password`;
	const userMailToken = "user_mail_token";
	const userToken = "valid_user_token";

	it("Throw an error when no mail stored in cookies", async () => {
		Cookies.get = jest.fn().mockReturnValue(null);
		mock.onPost(url).reply(401);
		await expect(updateUser("pwd", "pwdNew")).rejects.toThrow("Missing user");
	});
	it("Throw an error when required fields are missing", async () => {
		await expect(updateUser("", "")).rejects.toThrow("Missing field");
	});
	it("Update user password successfully", async () => {
		const mockResponse = {
			message: "Password updated successfully",
		};
		Cookies.set("userMailToken", userMailToken);
		Cookies.set("userToken", userToken);

		// Mock the response with success message
		mock.onPut(url).reply(200, mockResponse);

		const response = await updateUser("old_password", "new_password");
		expect(response).toEqual(mockResponse);
	});
	it("Throw an error when user update fails", async () => {
		Cookies.set("userMailToken", userMailToken);
		Cookies.set("userToken", userToken);

		// Mock the response with an empty object (no user data)
		mock.onPut(url).reply(200, null);

		await expect(updateUser("old_password", "new_password")).rejects.toThrow(
			"User could not be updated"
		);
	});
	it("Handle network errors and throw an error with the correct message", async () => {
		Cookies.set("userMailToken", userMailToken);
		Cookies.set("userToken", userToken);

		// Mock a network error for the API call
		mock.onPut(url).networkError();
		await expect(updateUser("old_password", "new_password")).rejects.toThrow(
			"Network Error"
		);
	});
});

describe("deleteUser", () => {
	const url = `${urlBase}/user/delete`;
	const userMailToken = "user_mail_token";
	const userToken = "valid_user_token";

	it("Throw an error when no mail stored in cookies", async () => {
		Cookies.get = jest.fn().mockReturnValue(null);
		await expect(deleteUser("password")).rejects.toThrow("Missing user");
	});
	it("Throw an error when required fields are missing", async () => {
		await expect(deleteUser("")).rejects.toThrow("Missing field");
	});
	it("Delete user account successfully", async () => {
		const mockResponse = {
			message: "Account deleted successfully",
		};
		Cookies.set("userMailToken", userMailToken);
		Cookies.set("userToken", userToken);

		// Mock the response with success message
		mock.onDelete(url).reply(200, mockResponse);
		const response = await deleteUser("password");
		expect(response).toEqual(mockResponse);
	});
	it("Throw an error when user account deletion fails", async () => {
		Cookies.set("userMailToken", userMailToken);
		Cookies.set("userToken", userToken);

		// Mock the response with an empty object (no data)
		mock.onDelete(url).reply(200, null);
		await expect(deleteUser("password")).rejects.toThrow("Could not delete account");
	});
	it("Handle network errors and throw an error with the correct message", async () => {
		Cookies.set("userMailToken", userMailToken);
		Cookies.set("userToken", userToken);

		// Mock a network error for the API call
		mock.onDelete(url).networkError();
		await expect(deleteUser("password")).rejects.toThrow("Network Error");
	});
});

describe("deleteUserAsAdmin", () => {
	const url = `${urlBase}/user/admin/delete`;
	const adminToken = "valid_admin_token";

	it("Throw an error when no mail provided", async () => {
		await expect(deleteUserAsAdmin("")).rejects.toThrow("Missing user");
	});

	it("Throw an error when not authorized", async () => {
		Cookies.get = jest.fn().mockReturnValue(null);
		mock.onDelete(url).reply(401);
		await expect(deleteUserAsAdmin("user@example.com")).rejects.toThrow(
			"Not authorized to access list of users."
		);
	});

	it("Delete user account as admin successfully", async () => {
		const mockResponse = {
			message: "Account deleted successfully",
		};
		Cookies.set("adminToken", adminToken);

		// Mock the response with success message
		mock.onDelete(url).reply(200, mockResponse);
		const response = await deleteUserAsAdmin("user@example.com");
		expect(response).toEqual(mockResponse);
	});

	it("Throw an error when user account deletion as admin fails", async () => {
		Cookies.set("adminToken", adminToken);

		// Mock the response with an empty object (no data)
		mock.onDelete(url).reply(200, null);
		await expect(deleteUserAsAdmin("user@example.com")).rejects.toThrow(
			"Could not delete account"
		);
	});

	it("Handle network errors and throw an error with the correct message", async () => {
		Cookies.set("adminToken", adminToken);

		// Mock a network error for the API call
		mock.onDelete(url).networkError();

		await expect(deleteUserAsAdmin("user@example.com")).rejects.toThrow("Network Error");
	});

	describe("fetchUserByMail", () => {
		const url = `${urlBase}/user`;
		const userMailToken = "user_mail_token";

		it("Throw an error when no userMail stored in cookies", async () => {
			Cookies.get = jest.fn().mockReturnValue(null);
			mock.onGet(url).reply(401);
			await expect(fetchUserByMail()).rejects.toThrow(
				"Not authorized access to user account."
			);
		});

		it("Fetch user by mail successfully", async () => {
			const mockResponse = {
				user: {
					mail: "user@example.com",
					creation_date: "2023-08-19T13:13:37.582Z",
				},
			};
			Cookies.set("userMailToken", userMailToken);

			// Mock the response with user data
			mock.onGet(url).reply(200, mockResponse);

			const response = await fetchUserByMail();
			expect(response).toEqual({
				mail: "user@example.com",
				creation_date: "2023-08-19T13:13:37.582Z",
			});
		});

		it("Throw an error when no user retrieved", async () => {
			Cookies.set("userMailToken", userMailToken);
			// Mock the response with an empty object (no user data)
			mock.onGet(url).reply(200, null);
			await expect(fetchUserByMail()).rejects.toThrow("No user found");
		});

		it("Handle network errors and throw an error with the correct message", async () => {
			Cookies.set("userMailToken", userMailToken);
			// Mock a network error for the API call
			mock.onGet(url).networkError();
			await expect(fetchUserByMail()).rejects.toThrow("Network Error");
		});
	});
});

import Cookies from "js-cookie";
import { createToken, deleteToken } from "./token-utils";

// Mock methods Cookies.remove and Cookies.set
jest.mock("js-cookie", () => ({
	remove: jest.fn(),
	set: jest.fn(),
}));

describe("deleteToken method", () => {
	it("Delete all tokens", () => {
		deleteToken();
		expect(Cookies.remove).toHaveBeenCalledTimes(3);
		expect(Cookies.remove).toHaveBeenCalledWith("userToken", { sameSite: "strict" });
		expect(Cookies.remove).toHaveBeenCalledWith("adminToken", { sameSite: "strict" });
		expect(Cookies.remove).toHaveBeenCalledWith("userMailToken", { sameSite: "strict" });
	});
});

describe("createToken method", () => {
	it("Create userToken when token is provided", () => {
		const token = "user-token";
		createToken(token, "");
		expect(Cookies.set).toHaveBeenCalledWith("userToken", token, {
			expires: 3,
			sameSite: "Strict",
		});
	});

	it("Create adminToken when token and admin user role are provided", () => {
		const token = "admin-token";
		createToken(token, "", true);
		expect(Cookies.set).toHaveBeenCalledWith("adminToken", token, {
			expires: 3,
			sameSite: "Strict",
		});
	});

	it("Create userMailToken when mail is provided", () => {
		const mail = "user@example.com";
		createToken("", mail);
		expect(Cookies.set).toHaveBeenCalledWith("userMailToken", mail, {
			expires: 3,
			sameSite: "Strict",
		});
	});

	it("Don't create any tokens if token and mail are not provided", () => {
		createToken("", "");
		expect(Cookies.set).not.toHaveBeenCalled();
	});
});

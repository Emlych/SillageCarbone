// -- this file will make the API calls to the server.
import Cookies from "js-cookie";

/** On deconnexion / deletion delete all tokens*/
export const deleteToken = (): void => {
	const allTokens = ["userToken", "adminToken", "userMailToken"];
	for (const token of allTokens) {
		Cookies.remove(token, { sameSite: "strict" });
	}
};

/** On connexion of user, create token and mailToken
 */
export const createToken = (token: string, mail: string, admin?: boolean): void => {
	if (!token && !mail) return;

	// -- Create tokens for connected user
	if (token) {
		// -- User role by default will be connected user
		const tokenString = admin ? "adminToken" : "userToken";
		Cookies.set(tokenString, token, { expires: 3, sameSite: "Strict" });
	}
	if (mail) {
		Cookies.set("userMailToken", mail, { expires: 3, sameSite: "Strict" });
	}
};

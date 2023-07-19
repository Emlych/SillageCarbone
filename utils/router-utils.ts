// Password management
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

/** Generate hash
 * @password
 * @salt
 */
export const generateHash = (password: string, salt: string): string => {
	return SHA256(password + salt).toString(encBase64);
};

/** Generate salt, hash and token
 * @password to convert (usually req.body.password)
 */
export const generateSaltHashToken = (
	password: string
): { newSalt: string; newHash: string; newToken: string } => {
	const newSalt = uid2(16);
	const newHash = SHA256(password + newSalt).toString(encBase64);
	const newToken = uid2(16);

	return { newSalt, newHash, newToken };
};

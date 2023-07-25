import express, { NextFunction, Request, Response } from "express";
import User, { UserType } from "../models/User";

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

/** Middleware function: authenticate user with the provided token and check its role
 * @param req : user request with headers' authorization
 * @param res : response
 * @param next : move to next function
 * @param requiredRole : enum UserType
 */
export const authenticateAndCheckUserRole = async (
	req: Request,
	res: Response,
	next: NextFunction,
	requiredRole: UserType
) => {
	try {
		// -- Extract from request header the `authorization` that contains the authentication token
		const tokenRegistered = req.headers.authorization;

		// -- If authorization header exists, query the db to find a user with the specified token
		if (tokenRegistered) {
			// -- Array of "User" documents that match with token extracted from header by removing the Bearer prefix
			const userWithToken = await User.find({
				token: tokenRegistered.replace("Bearer ", ""),
			});
			// -- One token always = one user
			if (userWithToken.length > 0) {
				// -- Check if the type of user matches the required role
				if (userWithToken[0].userType === requiredRole) {
					next();
					return; // Return to prevent executing the catch block
				}
			}
		}
		// -- User is not authenticated or does not have the required role
		throw new Error("User not found or not authorized to access these informations");
	} catch (error: any) {
		// No `authorization` header or no user found with the specified token, respond with 401 status code and an error message
		res.status(401).json({ message: error.message });
	}
};

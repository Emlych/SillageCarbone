import { Request, Response } from "express";
import User, { UserType } from "../models/User";
import { generateHash, generateSaltHashToken } from "../utils/router-utils";
import { endOfDay, startOfDay } from "date-fns";
import mongoose from "mongoose";

interface UserFilters {
	mail: RegExp;
	creation_date: mongoose.FilterQuery<mongoose.Schema.Types.ObjectId>;
}

// Controller for creating an admin user
export const createAdminUser = async (req: Request, res: Response) => {
	console.info("Route: /admin/backoffice");
	try {
		// -- Check if mail and password were provided
		if (!req.body || !req.body.mail || !req.body.password) {
			throw new Error("Missing field(s)");
		}

		// -- Check if email doesn't already exists
		if (await User.findOne({ mail: req.body.mail })) {
			throw new Error("User already exists");
		}

		// -- Generate hash et token
		const { newSalt, newHash, newToken } = generateSaltHashToken(req.body.password);

		// -- Register new user
		const newUser = new User({
			mail: req.body.mail,
			token: newToken,
			hash: newHash,
			salt: newSalt,
			userType: UserType.Admin,
			creation_date: new Date(),
		});
		await newUser.save();

		res.status(200).json({
			_id: newUser._id,
			mail: newUser.mail,
			token: newUser.token,
		});
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
};

// Controller for creating a user (with token)
export const createUser = async (req: Request, res: Response) => {
	console.info("Route: /user/create");
	try {
		// -- Check if mail and password were provided
		if (!req.body || !req.body.mail || !req.body.password) {
			throw new Error("Missing field(s)");
		}

		// -- Check if email doesn't already exists
		if (await User.findOne({ mail: req.body.mail })) {
			throw new Error("User already exists");
		}

		// -- Generate salt, hash et token
		const { newSalt, newHash, newToken } = generateSaltHashToken(req.body.password);

		// -- If user role is specified, set it to userType, default value will be connected user
		const userType = req.body.userType || UserType.ConnectedUser;

		// -- Register new user
		const newUser = new User({
			mail: req.body.mail,
			token: newToken,
			hash: newHash,
			salt: newSalt,
			userType,
			creation_date: new Date(),
		});
		await newUser.save();

		res.status(200).json({
			_id: newUser._id,
			mail: newUser.mail,
			token: newUser.token,
		});
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
};

// Controller for login a user
export const loginUser = async (req: Request, res: Response) => {
	console.info("Route: /user/login");
	try {
		// -- Check if mail and password was provided
		if (!req.body || !req.body.mail || !req.body.password) {
			throw new Error("Missing field(s)");
		}

		// -- Find user with provided mail
		const searchedUser = await User.findOne({ mail: req.body.mail });
		if (!searchedUser || !searchedUser.salt) {
			throw new Error("Unauthorized connexion");
		}

		// -- Generate hash from password to compare with database hash to check if password is correct
		const newHash = generateHash(req.body.password, searchedUser.salt);
		if (newHash === searchedUser["hash"]) {
			return res.status(200).json({ message: "Authorized connexion", searchedUser });
		} else {
			throw new Error("Unauthorized connexion");
		}
	} catch (error: any) {
		return res.status(500).json({ message: error.message });
	}
};

// Controller for getting all users
export const getUsers = async (req: Request, res: Response) => {
	console.info("Route : /users");

	try {
		// Retrieve request queries to fill filtersObject with all used filters
		const requestFilters: UserFilters = {
			mail: new RegExp("", "i"),
			creation_date: { $gte: new Date() },
		};
		const requestQuery = req.query;

		if (requestQuery) {
			// -- Apply filters
			if (requestQuery.mail) {
				requestFilters.mail = new RegExp(`${requestQuery.mail}`, "i");
			}
			if (requestQuery.start_date) {
				const startDate = new Date(requestQuery.start_date.toString());
				const startOfDayDate = startOfDay(startDate);
				requestFilters.creation_date = { $gte: startOfDayDate };
			}

			if (requestQuery.finish_date) {
				const finishDate = new Date(requestQuery.finish_date.toString());
				const endOfDayDate = endOfDay(finishDate);
				requestFilters.creation_date = { $lte: endOfDayDate };
			}

			// -- Limit data with page and max items per page
			let page = parseInt(requestQuery.page as string) ?? 1;
			let maxItemPerPage = parseInt(requestQuery.limit as string) ?? 2;

			// -- Retrieve users
			const users = await User.find(requestFilters)
				.skip((page - 1) * maxItemPerPage)
				.limit(maxItemPerPage);

			// -- Number of retrieved users
			const count = await User.countDocuments(requestFilters);

			// -- Send response to front
			res.json({ count: count, users: users });
		}
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
};

// Controller for updating password
export const updateUserPassword = async (req: Request, res: Response) => {
	console.info("route: /user/change-password");
	try {
		// -- Check all fields were provided
		if (!req.body || !req.body.mail || !req.body.password || !req.body.newPassword) {
			throw new Error("Missing field(s)");
		}

		// -- Find user with provided mail
		const searchedUser = await User.findOne({ mail: req.body.mail });
		if (!searchedUser || !searchedUser.salt) {
			throw new Error("Unauthorized connexion");
		}

		// -- Generate hash from password to compare with database hash to check if actual password is correct
		const actualPasswordNewHash = generateHash(req.body.password, searchedUser.salt);
		if (actualPasswordNewHash !== searchedUser["hash"]) {
			throw new Error("Incorrect password");
		}

		// -- Generate hash et token on new password input
		const { newSalt, newHash, newToken } = generateSaltHashToken(req.body.newPassword);

		// -- Update token, salt and hash
		searchedUser.token = newToken;
		searchedUser.salt = newSalt;
		searchedUser.hash = newHash;

		// -- Register change
		await searchedUser.save();
		res.status(200).json({
			message: `Password udpate for ${req.body.mail}`,
			mail: searchedUser.mail,
			token: searchedUser.token,
		});
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
};

// Controller for deleting user as connected user
export const deleteUser = async (req: Request, res: Response) => {
	console.info("route: /user/delete");
	try {
		// -- Check all fields were provided
		if (!req.body || !req.body.mail || !req.body.password) {
			throw new Error("Missing field(s)");
		}

		// -- Retrieve account
		const searchedUser = await User.findOne({ mail: req.body.mail });
		if (!searchedUser || !searchedUser.salt) {
			throw new Error("No user found");
		}

		// -- Generate hash from password to compare with database hash to check if password is correct
		const passwordHash = generateHash(req.body.password, searchedUser.salt);
		if (passwordHash !== searchedUser["hash"]) {
			throw new Error("Incorrect password");
		}

		// -- Delete account
		await User.deleteOne({ mail: req.body.mail });
		res.status(200).json("User deleted");
	} catch (error: any) {
		return res.status(500).json({ error: error.message });
	}
};

// Controller for delete user as admin
export const deleteUserAsAdmin = async (req: Request, res: Response) => {
	console.info("route: /user/admin/delete");
	try {
		// -- Check all fields were provided
		if (!req.body || !req.body.mail) {
			throw new Error("Missing field(s)");
		}

		// -- Retrieve account
		const searchedUser = await User.findOne({ mail: req.body.mail });
		if (!searchedUser) {
			throw new Error("No user found");
		}

		// -- Delete account
		await User.deleteOne({ mail: req.body.mail });
		res.status(200).json("User deleted");
	} catch (error: any) {
		return res.status(500).json({ error: error.message });
	}
};

//Controler get user info (mail and creation date)
export const getUserInfo = async (req: Request, res: Response) => {
	console.info("Route : /user");
	try {
		if (req.query.userMail) {
			// -- Retrieve user
			const user = await User.findOne({ mail: req.query.userMail });

			// -- Send response to front
			res.json({ user: user });
		}
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
};

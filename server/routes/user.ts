import express, { NextFunction, Request, Response } from "express";
import User, { UserType } from "../models/User";
import { endOfDay, startOfDay } from "date-fns";
import { body, validationResult } from "express-validator";
import {
	authenticateAndCheckUserRole,
	generateHash,
	generateSaltHashToken,
} from "../utils/router-utils";
import mongoose from "mongoose";

const router = express.Router();

interface UserFilters {
	mail: RegExp;
	creation_date: mongoose.FilterQuery<mongoose.Schema.Types.ObjectId>;
}

/** User role is admin ?
 * @param req : user request with headers' authorization
 * @param res : response
 * @param next : move to next function
 */
const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
	await authenticateAndCheckUserRole(req, res, next, UserType.Admin);
};

/** User role is connected user ?
 * @param req : user request with headers' authorization
 * @param res : response
 * @param next : move to next function
 */
const isConnectedUser = async (req: Request, res: Response, next: NextFunction) => {
	await authenticateAndCheckUserRole(req, res, next, UserType.ConnectedUser);
};

/** Validation middleware */
const validateAndSanitizeInputs = [
	// -- mail format, can't be empty
	body("mail").isEmail().normalizeEmail().escape().withMessage("Invalid mail format"),
	// -- password at least 5 chars long
	body("password").isLength({ min: 8 }).withMessage("Password doesn't respect format"),
	(req: Request, res: Response, next: NextFunction) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.info("rrors ", errors);
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
];

/** Create admin route (used only once to create one admin acount from login page)*/
router.post(
	"/user/admin/backoffice",
	validateAndSanitizeInputs,
	async (req: Request, res: Response) => {
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
	}
);

/** Connexion route : create a new user with token */
router.post(
	"/user/create",
	validateAndSanitizeInputs,
	async (req: Request, res: Response) => {
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
	}
);

/** Login route : provide mail and password to return */
router.post("/user/login", async (req: Request, res: Response) => {
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
});

/** Get all users - backoffice */
router.get("/users", isAdmin, async (req: Request, res: Response) => {
	try {
		console.info("Route : /users");

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
});

/** Update user password */
router.put(
	"/user/change-password",
	isConnectedUser,
	async (req: Request, res: Response) => {
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
			res.status(200).json({ message: `Password udpate for ${req.body.mail}` });
		} catch (error: any) {
			res.status(400).json({ message: error.message });
		}
	}
);

/** Delete user route */
router.delete("/user/delete", isConnectedUser, async (req: Request, res: Response) => {
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
});

/** Delete user as admin route  */
router.delete("/user/admin/delete", isAdmin, async (req: Request, res: Response) => {
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
});

/** Provide mail to return creation date of a user route */
router.get("/user/mail", async (req: Request, res: Response) => {
	console.info("Route: /product/mail");

	try {
		// -- Check if id was provided
		const userMail = req.body.mail;
		if (!userMail) {
			throw new Error("No mail provided");
		}
		const searchedUser = await User.findOne({ mail: userMail });
		if (!searchedUser) {
			throw new Error("User not found.");
		}
		return res.status(200).json({ creation_date: searchedUser.creation_date });
	} catch (error: any) {
		return res.status(400).json({ error: error.message });
	}
});

module.exports = router;

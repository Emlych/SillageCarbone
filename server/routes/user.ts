import express, { NextFunction, Request, Response } from "express";
import { UserType } from "../models/User";
import { body, validationResult } from "express-validator";
import { authenticateAndCheckUserRole } from "../utils/router-utils";
import {
	createAdminUser,
	createUser,
	deleteUser,
	deleteUserAsAdmin,
	getUserInfo,
	getUsers,
	loginUser,
	updateUserPassword,
} from "../controllers/userController";

const router = express.Router();

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
	// -- password at least 12 chars long
	body("password").isLength({ min: 12 }).withMessage("Password doesn't respect format"),
	(req: Request, res: Response, next: NextFunction) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.error("Validation errors:", errors.array());
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
];

/** Create admin route (used only once to create one admin acount from login page)*/
router.post("/user/admin/backoffice", validateAndSanitizeInputs, createAdminUser);

/** Connexion route : create a new user with token */
router.post("/user/create", validateAndSanitizeInputs, createUser);

/** Login route : provide mail and password to return */
router.post("/user/login", loginUser);

/** Get all users - backoffice */
router.get("/users", isAdmin, getUsers);

/** Update user password */
router.put("/user/change-password", isConnectedUser, updateUserPassword);

/** Delete user route */
router.delete("/user/delete", isConnectedUser, deleteUser);

/** Delete user as admin route  */
router.delete("/user/admin/delete", isAdmin, deleteUserAsAdmin);

/** Provide mail to return creation date of a user route */
router.get("/user", getUserInfo);

module.exports = router;

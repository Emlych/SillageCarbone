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

/**
 * Create admin route (used only once to create one admin account from the login page).
 * @route POST /user/admin/backoffice
 * @tags user
 * @param {string} mail.body.required - Email of the admin user.
 * @param {string} password.body.required - Password of the admin user.
 * @return {object} 200 - Success response with admin user information.
 * @return {object} 400 - Bad request or error message.
 */
router.post("/user/admin/backoffice", validateAndSanitizeInputs, createAdminUser);

/**
 * Connexion route: create a new user with a token.
 * @route POST /user/create
 * @tags user
 * @param {string} mail.body.required - Email of the user.
 * @param {string} password.body.required - Password of the user.
 * @param {string} userType.body - Type of the user (default is 'ConnectedUser').
 * @return {object} 200 - Success response with user information.
 * @return {object} 400 - Bad request or error message.
 */
router.post("/user/create", validateAndSanitizeInputs, createUser);

/**
 * Login route: provide email and password to authenticate a user.
 * @route POST /user/login
 * @tags user
 * @param {string} mail.body.required - Email of the user.
 * @param {string} password.body.required - Password of the user.
 * @return {object} 200 - Success response indicating authorized login and user information.
 * @return {object} 500 - Internal server error or error message.
 */
router.post("/user/login", loginUser);

/**
 * Get all users - backoffice.
 * @route GET /users
 * @tags user
 * @param {string} mail.query - Filter users by email.
 * @param {string} start_date.query - Filter users created on or after this date (YYYY-MM-DD).
 * @param {string} finish_date.query - Filter users created on or before this date (YYYY-MM-DD).
 * @param {number} page.query - Page number for pagination (default is 1).
 * @param {number} limit.query - Maximum number of items per page (default is 2).
 * @return {object} 200 - Success response with user count and information.
 * @return {object} 400 - Bad request or error message.
 */
router.get("/users", isAdmin, getUsers);

/**
 * Update user password.
 * @route PUT /user/change-password
 * @tags user
 * @param {string} mail.body.required - Email of the user.
 * @param {string} password.body.required - Current password of the user.
 * @param {string} newPassword.body.required - New password for the user.
 * @return {object} 200 - Success response indicating password update and user information.
 * @return {object} 400 - Bad request or error message.
 */
router.put("/user/change-password", isConnectedUser, updateUserPassword);

/**
 * Delete user route.
 * @route DELETE /user/delete
 * @tags user
 * @param {string} mail.body.required - Email of the user.
 * @param {string} password.body.required - Password of the user.
 * @return {object} 200 - Success response indicating user deletion.
 * @return {object} 500 - Internal server error or error message.
 */
router.delete("/user/delete", isConnectedUser, deleteUser);

/**
 * Delete user as admin route.
 * @route DELETE /user/admin/delete
 * @tags user
 * @param {string} mail.body.required - Email of the user.
 * @return {object} 200 - Success response indicating user deletion.
 * @return {object} 500 - Internal server error or error message.
 */
router.delete("/user/admin/delete", isAdmin, deleteUserAsAdmin);

/**
 * Provide email to return creation date of a user route.
 * @route GET /user
 * @tags user
 * @param {string} userMail.query - Email of the user.
 * @return {object} 200 - Success response with user information.
 * @return {object} 400 - Bad request or error message.
 */
router.get("/user", getUserInfo);

module.exports = router;

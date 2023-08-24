import express, { NextFunction, Request, Response } from "express";
import User from "../models/User";
import {
	createTransport,
	deleteTransport,
	getTransports,
} from "../controllers/transportationController";

const router = express.Router();

/** User role is admin */
const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const adminTokenRegistered = req.headers.authorization;
		if (adminTokenRegistered) {
			const isAdmin = await User.find({
				token: adminTokenRegistered.replace("Bearer ", ""),
			});
			if (isAdmin) {
				next();
			} else {
				throw new Error("Unauthorized to access these informations");
			}
		}
	} catch (error: any) {
		res.status(401).json({ message: error.message });
	}
};

/**
 * POST /product/transportation/create
 * @summary Create a product transportation
 * @tags transportation
 * @param {string} transportation.body.required - Name of the transportation.
 * @param {number} carbonCoefficient.body.required - Carbon coefficient of the transportation.
 * @return {object} 200 - Success response with created transportation information.
 * @return {object} 400 - Bad request or error message.
 */
router.post("/product/transportation/create", isAdmin, createTransport);

/**
 * GET /transportations
 * @summary Get all transportations
 * @tags transportation
 * @return {object} 200 - Success response with array of transportations.
 * @return {object} 400 - Bad request or error message.
 */
router.get("/transportations", isAdmin, getTransports);

/**
 * DELETE /transportation/delete
 * @summary Delete one transportation: only if no products depend on it
 * @tags transportation
 * @param {string} _id.body.required - ID of the transportation to be deleted.
 * @return {object} 200 - Success response indicating whether the transportation was deleted or not.
 * @return {object} 400 - Bad request or error message.
 */
router.delete("/transportation/delete", isAdmin, deleteTransport);
module.exports = router;

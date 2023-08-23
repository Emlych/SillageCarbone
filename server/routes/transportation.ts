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

/** Create a product transportation */
router.post("/product/transportation/create", isAdmin, createTransport);

/** Get all transportations */
router.get("/transportations", isAdmin, getTransports);

/** Delete one transportation: only if no products depend on it */
router.delete("/transportation/delete", isAdmin, deleteTransport);
module.exports = router;

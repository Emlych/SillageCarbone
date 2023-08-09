import express, { NextFunction, Request, Response } from "express";
import Transportation from "../models/Transportation";
import User from "../models/User";
import Product from "../models/Product";

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
router.post(
	"/product/transportation/create",
	isAdmin,
	async (req: Request, res: Response) => {
		console.info("Route: /product/transportation/create");
		try {
			// -- Check if mandatory body were provided
			if (!req.body || !req.body.transportation || !req.body.carbonCoefficient) {
				throw new Error("Missing field(s)");
			}

			// -- Check if transportation already exists
			let transportation = await Transportation.findOne({
				name: req.body.transportation,
			});
			if (transportation) {
				throw new Error("Transportation type already exists");
			}

			// -- Create transportation
			const newTransportation = new Transportation({
				name: req.body.transportation,
				carbonCoefficient: req.body.carbonCoefficient,
				productsIds: [],
				creation_date: new Date(),
				archived: false,
			});

			// -- Save
			await newTransportation.save();

			res.status(200).json({
				_id: newTransportation._id,
				name: newTransportation.name,
				carbonCoefficient: newTransportation.carbonCoefficient,
			});
		} catch (error: any) {
			return res.status(400).json({ error: error.message });
		}
	}
);

/** Get all transportations */
router.get("/transportations", isAdmin, async (req: Request, res: Response) => {
	console.info("Route: /transportations");
	try {
		const transportations = await Transportation.find();
		res.json({ transportations: transportations });
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
});

/** Delete one transportation: only if no products depend on it */
router.delete("/transportation/delete", isAdmin, async (req: Request, res: Response) => {
	console.info("route: /transportation/delete");
	try {
		// -- Check all fields were provided
		if (!req.body || !req.body._id) {
			throw new Error("Missing field(s)");
		}

		// -- Check transportation exists in database
		const searchedTransportation = await Transportation.findById(req.body._id);
		if (!searchedTransportation) {
			throw new Error("No transportation found");
		}
		const transportationId = searchedTransportation._id;

		// -- Check if any products use this transportation
		const productsUsingTransportation = await Product.find({
			transportation: transportationId,
		});
		if (productsUsingTransportation.length > 0) {
			if (productsUsingTransportation.length === 1) {
				return res.status(200).json({
					canDelete: false,
					message: `Utilisé par ${productsUsingTransportation[0].name} -  ${productsUsingTransportation[0].company} `,
				});
			} else {
				return res.status(200).json({
					canDelete: false,
					message: "Utilisé par plusieurs produits",
				});
			}
		} else {
			// -- No products are using this transportation, so delete it
			await Transportation.deleteOne({ _id: req.body._id });
			return res.status(200).json({ canDelete: true, message: "Transportation deleted" });
		}
	} catch (error: any) {
		return res.status(500).json({ canDelete: false, error: error.message });
	}
});
module.exports = router;

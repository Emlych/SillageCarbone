import express, { Request, Response } from "express";
import Transportation from "../models/Transportation";

const router = express.Router();

/** Create a product transportation */
router.post("/product/transportation/create", async (req: Request, res: Response) => {
	console.info("Route: /product/transportation/create");
	try {
		// -- Check if mandatory body were provided
		if (!req.body || !req.body.transportation || !req.body.carbonCoefficient) {
			throw new Error("Missing field(s)");
		}

		// -- Check if transportation already exists
		let transportation = await Transportation.findOne({ name: req.body.transportation });
		if (transportation) {
			throw new Error("Transportation type already exists");
		}

		// -- Create transportation
		const newTransportation = new Transportation({
			name: req.body.transportation,
			carbonCoefficient: req.body.carbonCoef,
			productId: [],
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
});

/** Get all transportations */
router.get("/transportations", async (req: Request, res: Response) => {
	console.info("Route: /transportations");
	try {
		if (req.query) {
			const transportations = await Transportation.find();
			res.json({ transportations: transportations });
		}
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
});

module.exports = router;

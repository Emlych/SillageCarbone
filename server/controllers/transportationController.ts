import { Request, Response } from "express";
import Transportation from "../models/Transportation";
import Product from "../models/Product";

// Controller for creating transport
export const createTransport = async (req: Request, res: Response) => {
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
		console.info("Can create a new transportation");

		// -- Create transportation
		const newTransportation = new Transportation({
			name: req.body.transportation,
			carbonCoefficient: req.body.carbonCoefficient,
			productsIds: [],
			creation_date: new Date(),
			archived: false,
		});

		console.info("transportation : ", newTransportation);

		// -- Save
		await newTransportation.save();

		res.status(200).json({
			_id: newTransportation._id,
			name: newTransportation.name,
			carbonCoefficient: newTransportation.carbonCoefficient,
		});
	} catch (error: any) {
		console.error("error in transportation creation ", error);
		return res.status(400).json({ error: error.message });
	}
};

// Controller for getting all transports user as admin
export const getTransports = async (req: Request, res: Response) => {
	console.info("Route: /transportations");
	try {
		const transportations = await Transportation.find();
		res.json({ transportations: transportations });
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
};

// Controller for deleting transport
export const deleteTransport = async (req: Request, res: Response) => {
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
};

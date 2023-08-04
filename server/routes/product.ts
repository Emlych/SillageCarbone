import express, { NextFunction, Request, Response } from "express";
import mongoose, { Types } from "mongoose";
//Models
import Product from "../models/Product";
import ProductType from "../models/ProductType";
import Transportation from "../models/Transportation";
import User from "../models/User";

const router = express.Router();
const cloudinary = require("cloudinary").v2;

//Credentials for cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Interfaces
interface AdminProductFilters {
	name: RegExp;
	company: RegExp;
	type_id?: mongoose.FilterQuery<mongoose.Schema.Types.ObjectId> | null;
	_id?: mongoose.FilterQuery<mongoose.Schema.Types.ObjectId>;
	archived?: Boolean;
}
interface UserProductFilters {
	type_id: mongoose.FilterQuery<mongoose.Schema.Types.ObjectId> | null;
	_id: mongoose.FilterQuery<mongoose.Schema.Types.ObjectId>;
	archived: Boolean;
}
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

/** Provide id to return all data on a product route */
router.get("/product/:_id", async (req: Request, res: Response) => {
	console.info("Route: /product/:_id");

	try {
		// -- Check if id was provided
		const productId = req.params._id;
		const product = await Product.findById(productId);
		if (!product) {
			return res.status(404).json({ error: "Product not found." });
		}
		return res.status(200).json({ product: product });
	} catch (error: any) {
		return res.status(400).json({ error: error.message });
	}
});

/** Get all products with filter route */
router.get("/products", isAdmin, async (req: Request, res: Response) => {
	console.info("Route: /products");
	try {
		// Retrieve request queries to fill filtersObject with all used filters
		const requestFilters: AdminProductFilters = {
			name: new RegExp("", "i"),
			company: new RegExp("", "i"),
			archived: false,
		};
		const requestQuery = req.query;

		if (requestQuery) {
			// -- Apply filters
			if (requestQuery.name && String(requestQuery.name).length > 0) {
				requestFilters.name = new RegExp(`${requestQuery.name}`, "i");
			}
			if (requestQuery.company && String(requestQuery.company).length > 0) {
				requestFilters.company = new RegExp(`${requestQuery.company}`, "i");
			}
			if (requestQuery.type && String(requestQuery.type).length > 0) {
				//requestFilters.type = new RegExp(`${requestQuery.type}`, "i");

				// -- Find the ProductType based on the name
				const productType = await ProductType.findOne({
					name: new RegExp(`${requestQuery.type}`, "i"),
				});

				if (productType) {
					requestFilters.type_id = new Types.ObjectId(productType._id);
				} else {
					requestFilters.type_id = null;
				}
			}
			// -- Optional filter to exclude a specific _id
			if (requestQuery.excludeId) {
				requestFilters._id = { $ne: req.query.excludeId };
			}

			// -- Limit data with page and max items per page
			let page = parseInt(requestQuery.page as string) ?? 1;
			let maxItemPerPage = parseInt(requestQuery.limit as string) ?? 2;

			// -- Retrieve products
			const products = await Product.find(requestFilters)
				.skip((page - 1) * maxItemPerPage)
				.limit(maxItemPerPage);

			// -- Number of retrieved products
			const count = await Product.countDocuments(requestFilters);

			// -- Send response to front
			res.json({ count: count, products: products });
		}
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
});

/** Get all products with filter route */
router.get("/products/caroussel", async (req: Request, res: Response) => {
	console.info("Route: /products/caroussel");
	try {
		// Retrieve request queries to fill filtersObject with all used filters
		const requestFilters: UserProductFilters = {
			_id: new RegExp("", "i"),
			type_id: new RegExp("", "i"),
			archived: false,
		};
		const requestQuery = req.query;

		if (requestQuery) {
			// -- Apply filters

			if (requestQuery.type && String(requestQuery.type).length > 0) {
				//requestFilters.type = new RegExp(`${requestQuery.type}`, "i");

				// -- Find the ProductType based on the name
				const productType = await ProductType.findOne({
					name: new RegExp(`${requestQuery.type}`, "i"),
				});

				if (productType) {
					requestFilters.type_id = new Types.ObjectId(productType._id);
				} else {
					requestFilters.type_id = null;
				}
			}
			// -- Optional filter to exclude a specific _id
			if (requestQuery.excludeId) {
				requestFilters._id = { $ne: req.query.excludeId };
			}

			// -- Limit data with page and max items per page
			let page = parseInt(requestQuery.page as string) ?? 1;
			let maxItemPerPage = parseInt(requestQuery.limit as string) ?? 2;

			// -- Retrieve products
			const products = await Product.find(requestFilters)
				.skip((page - 1) * maxItemPerPage)
				.limit(maxItemPerPage);

			// -- Number of retrieved products
			const count = await Product.countDocuments(requestFilters);

			// -- Send response to front
			res.json({ count: count, products: products });
		}
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
});
/** Get all products without filter route */
router.get("/products/cache", async (req: Request, res: Response) => {
	console.info("Route: /products/cache");
	try {
		if (req.query) {
			const products = await Product.find({}, "_id name company");
			if (!products) {
				return res.status(404).json({ error: "No products foud." });
			}

			res.status(200).json({ products: products });
		}
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
});

/** Get all archived products with filter route */
router.get("/products/archived", isAdmin, async (req: Request, res: Response) => {
	console.info("Route: /products/archived");
	try {
		// Retrieve request queries to fill filtersObject with all used filters
		const requestFilters: AdminProductFilters = {
			name: new RegExp("", "i"),
			company: new RegExp("", "i"),
			archived: true,
		};
		const requestQuery = req.query;

		if (requestQuery) {
			// -- Apply filters
			if (requestQuery.name && String(requestQuery.name).length > 0) {
				requestFilters.name = new RegExp(`${requestQuery.name}`, "i");
			}
			if (requestQuery.company && String(requestQuery.company).length > 0) {
				requestFilters.company = new RegExp(`${requestQuery.company}`, "i");
			}
			if (requestQuery.type && String(requestQuery.type).length > 0) {
				//requestFilters.type = new RegExp(`${requestQuery.type}`, "i");

				// -- Find the ProductType based on the name
				const productType = await ProductType.findOne({
					name: new RegExp(`${requestQuery.type}`, "i"),
				});

				if (productType) {
					requestFilters.type_id = new Types.ObjectId(productType._id);
				} else {
					requestFilters.type_id = null;
					// // If the ProductType doesn't exist, return an empty response
					// res.json({ count: 0, products: [] });
					// return;
				}
			}

			// -- Limit data with page and max items per page
			let page = parseInt(requestQuery.page as string) ?? 1;
			let maxItemPerPage = parseInt(requestQuery.limit as string) ?? 2;

			// -- Retrieve products
			const products = await Product.find(requestFilters)
				.skip((page - 1) * maxItemPerPage)
				.limit(maxItemPerPage);

			// -- Number of retrieved products
			const count = await Product.countDocuments(requestFilters);

			// -- Send response to front
			res.json({ count: count, products: products });
		}
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
});

/** Create a product route */
router.post("/product/create", isAdmin, async (req: Request, res: Response) => {
	console.info("Route: /product/create");
	try {
		// -- Check if mandatory body were provided
		if (
			!req.body ||
			!req.body.name ||
			!req.body.company ||
			!req.body.type ||
			!req.body.transportation ||
			!req.body.originHarbour ||
			!req.body.destinationHarbour
		) {
			throw new Error("Missing field(s)");
		}

		// -- Check if product type already exists, if not create it
		let productType = await ProductType.findOne({ name: req.body.type });
		if (!productType) {
			const newType = new ProductType({
				name: req.body.type,
				productId: [],
				creation_date: new Date(),
				archived: false,
			});
			productType = newType;
		}

		// -- Check if transportation already exists, if not create it
		let transportation = await Transportation.findOne({ name: req.body.transportation });
		if (!transportation) {
			//TODO code à supprimer une fois la rubrique "transport créée"
			const newTransportation = new Transportation({
				name: req.body.transportation,
				productId: [],
				creation_date: new Date(),
				archived: false,
			});
			console.info("new type", newTransportation);
			transportation = newTransportation;
		}

		// -- Define distance
		// Depending on start and finish harbour calculate distance
		let defaultDistance = 12430;

		// -- Calculate co2 transportation coefficient
		const transportationCoef = transportation.carbonCoefficient;
		const co2 = transportationCoef * defaultDistance;

		// -- Create new product
		const newProduct = new Product({
			name: req.body.name,
			company: req.body.company,
			co2,
			type: productType,
			description: req.body.description ?? "",
			transportation: req.body.transportation,
			distance: defaultDistance,
			origin_harbour: req.body.originHarbour,
			destination_harbour: req.body.destinationHarbour,
			creation_date: new Date(),
		});

		// Upload photo on cloudinary
		if (req.files) {
			// const pictureToUpload = req.files.picture.path;
			// const result = await cloudinary.uploader.upload(pictureToUpload, {
			// 	public_id: ``,
			// });
		}

		// -- Push id of product inside productType
		productType.productsIds.push(newProduct._id);

		// -- Save
		await productType.save();
		await newProduct.save();

		res.status(200).json({
			_id: newProduct._id,
			product_name: newProduct.name,
			co2: newProduct.co2,
		});
	} catch (error: any) {
		return res.status(400).json({ error: error.message });
	}
});

/** Delete a product route */
router.delete("/product/delete", isAdmin, async (req: Request, res: Response) => {
	console.info("route: /product/delete");
	try {
		// -- Check all fields were provided
		if (!req.body || !req.body._id) {
			throw new Error("Missing field(s)");
		}

		// -- Check product exists in database
		const searchedProduct = await Product.findById(req.body._id);
		if (!searchedProduct) {
			throw new Error("No product found");
		}

		// -- Delete product
		await Product.deleteOne({ _id: req.body._id });
		res.status(200).json("User deleted");
	} catch (error: any) {
		return res.status(500).json({ error: error.message });
	}
});

/** Archive a product route */
router.put("/product/archive", isAdmin, async (req: Request, res: Response) => {
	console.info("route: /product/archive");
	try {
		// -- Check all fields were provided
		if (!req.body || !req.body._id || req.body.archive === undefined) {
			console.info("missing field?");
			throw new Error("Missing field(s)");
		}

		// -- Check product exists in database
		const searchedProduct = await Product.findOne({ _id: req.body._id });
		if (!searchedProduct) {
			throw new Error("No product found");
		}
		searchedProduct.archived = req.body.archive;

		// -- Register change
		await searchedProduct.save();
		res.status(200).json({
			message: `Product ${searchedProduct.name} ${
				searchedProduct.archived ? "archived" : "non archived"
			}`,
		});
	} catch (error: any) {
		res.status(400).json({ message: error.message });
	}
});

module.exports = router;

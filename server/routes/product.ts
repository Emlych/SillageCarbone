import express, { NextFunction, Request, Response } from "express";
import mongoose, { Types } from "mongoose";
//Models
import Product from "../models/Product";
import ProductType from "../models/ProductType";
import Transportation from "../models/Transportation";
import User from "../models/User";
import Harbour from "../models/Harbour";

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
		const product = await Product.findOne({ _id: productId })
			.populate({
				path: "productType",
				select: "name",
			})
			.populate({
				path: "origin_harbour",
				select: "city country",
			})
			.populate({
				path: "destination_harbour",
				select: "city country",
			})
			.populate({
				path: "transportation",
				select: "name",
			});
		if (!product) {
			return res.status(404).json({ error: "Product not found." });
		}
		console.info("product is ", product);
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
		const requestQuery = req.query;
		if (!requestQuery) {
			throw new Error("Missing queries");
		}

		if (
			requestQuery.type &&
			String(requestQuery.type).length > 0 &&
			requestQuery.excludeId
		) {
			// -- Find the ProductType based on the name
			const productType = await ProductType.findOne({
				name: new RegExp(`${requestQuery.type}`, "i"), // voir pour retirer les regex non nécessaire (voir dangereux?)
			});

			if (!productType) {
				throw new Error("This product type doesn't exist");
			}

			// -- Retrieve array of products ids (filter out excluded id)
			const similarProductsIds = productType.productsIds.filter(
				(id) => String(id) !== String(requestQuery.excludeId)
			);

			// -- From array of ids, retrieve all products
			const products: any[] = await Promise.all(
				similarProductsIds.map(async (id) => {
					return await Product.findById(id);
				})
			);

			// -- Send response to front
			console.info("products array ", products);
			res.json({ count: similarProductsIds.length, products: products });
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
			!req.body.originCity ||
			!req.body.originCountry ||
			!req.body.destinationCity ||
			!req.body.destinationCountry
		) {
			throw new Error("Missing field(s)");
		}

		// -- Check if product type already exists, if not create it
		let productType = await ProductType.findOne({ name: req.body.type });
		if (!productType) {
			const newType = new ProductType({
				name: req.body.type,
				productsIds: [],
				creation_date: new Date(),
				archived: false,
			});
			productType = newType;
		}

		// -- Check if transportation already exists, if not create it
		let transportation = await Transportation.findOne({ name: req.body.transportation });
		if (!transportation) {
			const newTransportation = new Transportation({
				name: req.body.transportation,
				productsIds: [],
				creation_date: new Date(),
				archived: false,
			});
			transportation = newTransportation;
		}
		// -- Define distance
		// Depending on start and finish harbour calculate distance
		let defaultDistance = 12430;

		// -- Calculate co2 transportation coefficient
		const transportationCoef = transportation.carbonCoefficient;
		const co2 = transportationCoef * defaultDistance;

		// -- Check if transportation already exists, if not create it
		let originHarbour = await Harbour.findOne({
			city: req.body.originCity,
			country: req.body.originCountry,
		});
		if (!originHarbour) {
			const newHarbour = new Harbour({
				city: req.body.originCity,
				country: req.body.originCountry,
				productsIds: [],
				creation_date: new Date(),
				archived: false,
			});
			originHarbour = newHarbour;
		}

		// -- Check if transportation already exists, if not create it
		let destinationHarbour = await Harbour.findOne({
			city: req.body.destinationCity,
			country: req.body.destinationCountry,
		});
		if (!destinationHarbour) {
			const newHarbour = new Harbour({
				city: req.body.destinationCity,
				country: req.body.destinationCountry,
				productsIds: [],
				creation_date: new Date(),
				archived: false,
			});
			destinationHarbour = newHarbour;
		}

		// -- Create new product
		const newProduct = new Product({
			name: req.body.name,
			company: req.body.company,
			co2,
			productType,
			description: req.body.description ?? "",
			transportation,
			distance: defaultDistance,
			origin_harbour: originHarbour,
			destination_harbour: destinationHarbour,
			creation_date: new Date(),
		});

		// Upload photo on cloudinary
		if (req.files) {
			// const pictureToUpload = req.files.picture.path;
			// const result = await cloudinary.uploader.upload(pictureToUpload, {
			// 	public_id: ``,
			// });
		}

		// -- Push id of product inside productType, transportation, originHarbour
		productType.productsIds.push(newProduct._id);
		transportation.productsIds.push(newProduct._id);
		originHarbour.productsIds.push(newProduct._id);
		destinationHarbour.productsIds.push(newProduct._id);

		// -- Save
		await productType.save();
		await transportation.save();
		await originHarbour.save();
		await destinationHarbour.save();
		await newProduct.save();

		res.status(200).json({
			_id: newProduct._id,
			name: newProduct.name,
			company: newProduct.company,
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

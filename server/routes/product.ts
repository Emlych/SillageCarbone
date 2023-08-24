import express, { NextFunction, Request, Response } from "express";
import multer from "multer";

//Models
import User from "../models/User";

// Controllers
import {
	archiveProduct,
	createProduct,
	deleteProduct,
	getArchivedProducts,
	getCacheProducts,
	getCarousselProducts,
	getProductById,
	getProducts,
} from "../controllers/productController";

const router = express.Router();

// -- Multer: handle uploading of files (images) posted, process and manage it before sending it to Cloudinary
const multerStorage = multer.memoryStorage();
const imageFilter = (request: Request, file: Express.Multer.File, callback: any) => {
	if (
		file.mimetype == "image/png" ||
		file.mimetype == "image/jpg" ||
		file.mimetype == "image/jpeg"
	) {
		// -- Check image format type, otherwise throw error
		callback(null, true);
	} else {
		callback(null, false);
		return callback(
			new Error("Incompatible format, only accept .png, .jpg and .jpeg"),
			false
		);
	}
};
const multerUpload = multer({ storage: multerStorage, fileFilter: imageFilter }); // create Multer instance and initialize it with storage option

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
 * GET /product/:_id
 * @summary Provide id to return all data on a product route
 * @tags product
 * @param {number} _id.path.required - Product ID
 * @return {object} 200 - success response - application/json
 * @return {object} 404 - Product not found
 */
router.get("/product/:_id", getProductById);

/**
 * GET /products
 * @summary Get all products with filter route
 * @tags product
 * @param {string} type.query.required - Product type for filtering.
 * @param {string} name.query - Filter products by name.
 * @param {string} company.query - Filter products by company.
 * @param {string} excludeId.query.required - ID of the product to exclude from results.
 * @return {object} 200 - Success response with filtered products and count.
 * @return {object} 400 - Bad request, missing queries or error message.
 */
router.get("/products", isAdmin, getProducts);

/**
 * GET /products/caroussel
 * @summary Get all products of same type
 * @tags product
 * @param {string} type.query.required - Product type for filtering
 * @param {string} excludeId.query.required - ID of the product to exclude from results
 * @return {object} 200 - Success response with carousel products and count
 * @return {object}  400 - Bad request, missing queries or error message
 */
router.get("/products/caroussel", getCarousselProducts);

/**
 * GET /products/cache
 * @summary Get all products without filter route
 * @tags product
 * @return {object} 200 - Success response with products (_id, name, company)
 * @return {object}  400 - Bad request, error message
 */
router.get("/products/cache", getCacheProducts);

/**
 * GET /products/archived
 * @summary Get all archived products with filter route
 * @tags product
 * @param {string} type.query.required - Product type for filtering.
 * @param {string} name.query - Filter products by name.
 * @param {string} company.query - Filter products by company.
 * @param {string} excludeId.query.required - ID of the product to exclude from results.
 * @return {object} 200 - Success response with products and count
 * @return {object}  400 - Bad request, error message
 */
router.get("/products/archived", isAdmin, getArchivedProducts);

/**
 * POST /product/create
 * @summary Create a product route
 * @tags product
 * @param {string} name.body.required - Name of the product.
 * @param {string} company.body.required - Company of the product.
 * @param {string} type.body.required - Product type.
 * @param {string} transportation.body.required - Transportation method.
 * @param {string} originCity.body.required - City of origin.
 * @param {string} originCountry.body.required - Country of origin.
 * @param {string} destinationCity.body.required - City of destination.
 * @param {string} destinationCountry.body.required - Country of destination.
 * @param {string} [description.body] - Description of the product.
 * @param {file} picture.body - Product image (file upload).
 * @return {object} 200 - Success response with created product information.
 * @return {object} 400 - Bad request or error message.
 */
router.post("/product/create", isAdmin, multerUpload.array("picture", 1), createProduct);

/**
 * DELETE /product/delete
 * @summary Delete a product
 * @tags product
 * @param {string} _id.query.required - ID of the product to be deleted.
 * @return {object} 200 - Success response with a message confirming product deletion.
 * @return {object} 400 - Bad request or error message.
 */
router.delete("/product/delete", isAdmin, deleteProduct);

/**
 * PUT /product/archive
 * @summary Archive a product
 * @tags product
 * @param {string} _id.query.required - ID of the product to be archived.
 * @return {object} 200 - Success response with a message confirming product deletion.
 * @return {object} 400 - Bad request, missing field or error message.
 */
router.put("/product/archive", isAdmin, archiveProduct);

module.exports = router;

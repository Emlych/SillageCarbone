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
 * @return {product: product} 200 - success response - application/json
 * @return {object} 404 - Product not found
 */
router.get("/product/:_id", getProductById);

/** Get all products with filter route */
router.get("/products", isAdmin, getProducts);

/** Get all products with filter route */
router.get("/products/caroussel", getCarousselProducts);

/** Get all products without filter route */
router.get("/products/cache", getCacheProducts);

/** Get all archived products with filter route */
router.get("/products/archived", isAdmin, getArchivedProducts);

/** Create a product route */
router.post("/product/create", isAdmin, multerUpload.array("picture", 1), createProduct);

/** Delete a product route */
router.delete("/product/delete", isAdmin, deleteProduct);

/** Archive a product route */
router.put("/product/archive", isAdmin, archiveProduct);

module.exports = router;

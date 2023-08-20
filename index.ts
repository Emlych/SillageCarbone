import dotenv from "dotenv";
import express, { Express } from "express";
import cors from "cors";
import mongoose from "mongoose";

dotenv.config();

/** Create an express app called sillageApp  */
export const sillageApp: Express = express();
sillageApp.use(cors());

/** Use middleware to parse incoming requests with JSON payloads */
sillageApp.use(express.json());

/* Check if MONGODB_URI is defined */
if (!process.env.MONGODB_URI) {
	throw new Error("MONGODB_URI environment variable is not defined.");
}

/** Connect to sillage-carbone db */
//.connect("mongodb://127.0.0.1:27017/sillage-carbone")
mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => console.info("Connected to database"))
	.catch((error) => {
		throw new Error("Could not connect to database");
	});

const userRoutes = require("./server/routes/user");
sillageApp.use(userRoutes);
const productRoutes = require("./server/routes/product");
sillageApp.use(productRoutes);
const transportationRoutes = require("./server/routes/transportation");
sillageApp.use(transportationRoutes);

/** Page not found */
sillageApp.all("*", (req, res) => {
	res.status(404).json({ message: "Page not found." });
});

/** Start the server (Returns http.Server on port 8000) */
sillageApp.listen(process.env.PORT, () => {
	console.info("Listening to Sillage Carbone application on 8000");
});

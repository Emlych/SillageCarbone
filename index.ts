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

/** Connect to sillage-carbone db */
mongoose
	.connect("mongodb://127.0.0.1:27017/sillage-carbone")
	.then(() => console.info("Connected to database"))
	.catch((error) => {
		throw new Error("Could not connect to database");
	});
//mongoose.connect(process.env.MONGODB_URI);

const userRoutes = require("./routes/user");
sillageApp.use(userRoutes);
const productRoutes = require("./routes/product");
sillageApp.use(productRoutes);
const transportationRoutes = require("./routes/transportation");
sillageApp.use(transportationRoutes);

/** Page not found */
sillageApp.all("*", (req, res) => {
	res.status(404).json({ message: "Page not found." });
});

/** Start the server (Returns http.Server on port 8000) */
sillageApp.listen(8000, () => {
	console.log("Listening to Sillage Carbone application on 8000");
});

import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server"; // crée une bdd MongoDB en mémoire spécifiquement pour les tests

let mongod: MongoMemoryServer | null = null;

export const connectDB = async () => {
	try {
		let dbUrl = "mongodb://username:password@localhost:27017";
		if (process.env.NODE_ENV === "test") {
			mongod = await MongoMemoryServer.create();
			dbUrl = mongod.getUri();
		}

		const conn = await mongoose.connect(dbUrl, {});

		console.log(`MongoDB connected: ${conn.connection.host}`);
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
};

export const disconnectDB = async () => {
	try {
		await mongoose.connection.close();
		if (mongod) {
			await mongod.stop();
		}
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
};

//module.exports = { connectDB, disconnectDB };

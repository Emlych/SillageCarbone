// import { sillageApp } from "../index";
// import request from "supertest"; // simule les requêtes HTTP
// import mongoose from "mongoose";
// import { MongoMemoryServer } from "mongodb-memory-server"; // crée une bdd MongoDB en mémoire spécifiquement pour les tests

// import { connectDB, disconnectDB } from "./test_db";

// describe("API test", () => {
// 	beforeAll(() => {
// 		connectDB();
// 	});

// 	afterAll(() => {
// 		disconnectDB();
// 	});

// 	describe("POST /api/test", () => {
// 		it("example request using a mocked database instance", async () => {
// 			const result = await request(sillageApp).get("/");
// 			const expectedMessage = `{"message":"Page not found."}`;
// 			expect(result.text).toEqual(expectedMessage);
// 			expect(result.statusCode).toEqual(404);

// 			expect(result.status).toBe(201);
// 		});
// 	});
// });
// // // Utiliser mongodb-memory-server pour créer une base de données MongoDB en mémoire pour les tests
// // // Create a new instance of MongoMemoryServer and start it
// // const mongod = MongoMemoryServer.create();

// // // Connect to db in memory
// // // const connect = async () => {
// // // 	const uri = (await mongod).getUri();
// // // 	await mongoose.connect(uri);
// // // };

// // // // Disconnect for db in memory
// // // const closeDatabase = async () => {
// // // 	await mongoose.connection.dropDatabase();
// // // 	await mongoose.connection.close();
// // // 	await (await mongod).stop();
// // // };

// // // // Clear db
// // // export const clearDatabase = async () => {
// // // 	const collections = mongoose.connection.collections;
// // // 	for (const key in collections) {
// // // 		const collection = collections[key];
// // // 		await collection.deleteMany({});
// // // 	}
// // // };

// // describe("GET routes", () => {
// // 	it("Page not found - return 404 code status", async () => {
// // 		const result = await request(sillageApp).get("/");
// // 		const expectedMessage = `{"message":"Page not found."}`;
// // 		expect(result.text).toEqual(expectedMessage);
// // 		expect(result.statusCode).toEqual(404);
// // 	});
// // 	// 	it("GET /product/notfound devrait retourner le code de statut 404", async () => {
// // 	// 		const response = await request(app).get("/product/notfound");
// // 	// 		expect(response.status).toBe(404);
// // 	// 	});
// // });
import { sillageApp } from "../../index";
import request from "supertest"; // simule les requêtes HTTP
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server"; // crée une bdd MongoDB en mémoire spécifiquement pour les tests

// Utiliser mongodb-memory-server pour créer une base de données MongoDB en mémoire pour les tests
// Create a new instance of MongoMemoryServer and start it
const mongod = MongoMemoryServer.create();

// Connect to db in memory
export const connect = async () => {
	const uri = (await mongod).getUri();
	await mongoose.connect(uri);
};

// Disconnect for db in memory
export const closeDatabase = async () => {
	await mongoose.connection.dropDatabase();
	await mongoose.connection.close();
	await (await mongod).stop();
};

// Clear db
export const clearDatabase = async () => {
	const collections = mongoose.connection.collections;
	for (const key in collections) {
		const collection = collections[key];
		await collection.deleteMany({});
	}
};

describe("GET routes", () => {
	it("Page not found - return 404 code status", async () => {
		const result = await request(sillageApp).get("/");
		const expectedMessage = `{"message":"Page not found."}`;
		expect(result.text).toEqual(expectedMessage);
		expect(result.statusCode).toEqual(404);
	});
	// 	it("GET /product/notfound devrait retourner le code de statut 404", async () => {
	// 		const response = await request(app).get("/product/notfound");
	// 		expect(response.status).toBe(404);
	// 	});
});

// describe("Test connexion to db", () => {
// 	// Exécute avant de lancer les tests
// 	beforeAll(async () => {
// 		connect();
// 	});

// 	// Exécute après la fin des tests
// 	afterAll(async () => {
// 		closeDatabase();
// 		clearDatabase();
// 	});

// 	it("Devrait se connecter à la base de données", async () => {
// 		const isConnected = mongoose.connection.readyState === 1;
// 		expect(isConnected).toBe(true);
// 	});
// });

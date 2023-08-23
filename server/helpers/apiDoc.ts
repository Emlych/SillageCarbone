const expressJSDocSwagger = require("express-jsdoc-swagger");
import express from "express";

const options = {
	info: {
		version: "1.0.0",
		title: "Sillage carbone",
		description: "",
	},
	baseDir: __dirname,
	filesPattern: ["../routes/*.ts", "../models/*.ts", "../controllers/*.ts"],
	// Doc URL
	swaggerUIPath: "/api-docs", //process.env.API_DOCUMENTATION_ROUTE,
	// Serve API doc
	exposeApiDocs: true,
	apiDocsPath: "/api/docs",
};

/**
 *
 * @param {express.Application} app Express application
 * @returns {object} Express JSDoc Swagger middleware that create web documentation
 */
const createSwaggerMiddleware = (app: express.Application) =>
	expressJSDocSwagger(app)(options);

export default createSwaggerMiddleware;

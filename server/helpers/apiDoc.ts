const expressJSDocSwagger = require("express-jsdoc-swagger");
import express from "express";

const options = {
	info: {
		version: "1.0.0",
		title: "Sillage carbone",
		description: "Backend routes",
	},
	baseDir: __dirname,
	filesPattern: [
		`${__dirname}/server/routes/*.ts`,
		`${__dirname}/server/models/*.ts`,
		`${__dirname}/server/controllers/*.ts`,
	],
	// Doc URL
	swaggerUIPath: "/api-docs",
	// Serve API doc
	exposeApiDocs: true,
	apiDocsPath: "/api/docs",
};

/**
 *
 * @param {express.Application} app Express application
 * @returns {object} Express JSDoc Swagger middleware that create web documentation
 */
const createSwaggerMiddleware = (app: express.Application) => {
	console.info("dir name is ", __dirname);
	expressJSDocSwagger(app)(options);
};

export default createSwaggerMiddleware;

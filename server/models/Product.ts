import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema({
	name: { type: String, maxLength: 50, required: true },
	company: { type: String, maxLength: 50, required: true },
	co2: { type: Number, min: 1, required: true },
	productType: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "ProductType",
	},
	description: { type: String, maxLength: 500 },
	imgUrl: { type: mongoose.Schema.Types.Mixed, default: {} },
	transportation: {
		type: Schema.Types.ObjectId,
		ref: "Transportation",
		required: true,
	},
	distance: { type: Number, required: true, minimum: 1 },
	origin_harbour: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "Harbour",
		maxLength: 50,
	},
	destination_harbour: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "Harbour",
		maxLength: 50,
	},
	creation_date: { type: Date, required: true },
	modification_date: { type: Date },
	archived: { type: Boolean, default: false },
});

const Product = mongoose.model("Product", ProductSchema);

export default Product;

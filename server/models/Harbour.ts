import mongoose, { Schema } from "mongoose";

// Defining a new Mongoose schema for the 'Harbour' collection in the database
const HarbourSchema = new Schema({
	city: { type: String, required: true, maxLength: 30 },
	country: { type: String, required: true, maxLength: 30 },
	productsIds: [{ type: Schema.Types.ObjectId, ref: "Product" }], //store the IDs of products associated with the ProductType.
	creation_date: { type: Date },
	archived: { type: Boolean, default: false },
});

// Creating a Mongoose model named 'Harbour' using the defined schema
const Harbour = mongoose.model("Harbour", HarbourSchema);

export default Harbour;

import mongoose, { Schema } from "mongoose";

const HarbourSchema = new Schema({
	name: { type: String, unique: true, required: true, maxLength: 30 },
	productsIds: [{ type: Schema.Types.ObjectId, ref: "Product" }], //store the IDs of products associated with the ProductType.
	creation_date: { type: Date },
	archived: { type: Boolean, default: false },
});

const Harbour = mongoose.model("Harbour", HarbourSchema);

export default Harbour;

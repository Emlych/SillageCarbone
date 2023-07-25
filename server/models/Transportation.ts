import mongoose, { Schema } from "mongoose";

const TransportationSchema = new Schema({
	name: { type: String, unique: true, required: true, maxLength: 30 },
	productsIds: [{ type: Schema.Types.ObjectId, ref: "Product" }], //store the IDs of products associated with the ProductType.
	carbonCoefficient: { type: Number, default: 1 },
	creation_date: { type: Date },
	archived: { type: Boolean, default: false },
});

const Transportation = mongoose.model("Transportation", TransportationSchema);

export default Transportation;

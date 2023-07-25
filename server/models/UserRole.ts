import mongoose, { Schema } from "mongoose";

const UserRoleSchema = new Schema({
	name: { type: String, unique: true, required: true, maxLength: 30 },
	usersIds: [{ type: Schema.Types.ObjectId, ref: "User" }], //store the IDs of products associated with the ProductType.
	creation_date: { type: Date },
	archived: { type: Boolean, default: false },
});

const UserRole = mongoose.model("UserRole", UserRoleSchema);

export default UserRole;

import mongoose, { Schema } from "mongoose";

export enum UserType {
	ConnectedUser = "connectedUser",
	Admin = "admin",
}

const UserSchema = new Schema({
	mail: { unique: true, type: String, required: true },
	token: { type: String, required: true },
	hash: { type: String, required: true },
	salt: { type: String, required: true },
	userType: {
		type: String,
		enum: Object.values(UserType),
		default: UserType.ConnectedUser,
		required: true,
	},
	creation_date: { type: Date, required: true },
	modification_date: { type: Date },
});

const User = mongoose.model("User", UserSchema);

export default User;

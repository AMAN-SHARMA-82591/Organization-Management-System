import mongoose, { Schema, Document, Model } from "mongoose";
import { IDesignation } from "../interfaces/designation.interface";
import { IOrganization } from "../interfaces/organization.interface";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  organization: IOrganization["_id"];
  designation: IDesignation["_id"];
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: { type: String, required: true },
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      // required: true
      default: null,
    },
    designation: {
      type: Schema.Types.ObjectId,
      ref: "Designation",
      default: null,
      // required: true,
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.model("User", UserSchema);
export default User;

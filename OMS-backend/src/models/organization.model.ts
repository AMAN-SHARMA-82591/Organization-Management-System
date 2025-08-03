import mongoose, { Schema, Model } from "mongoose";
import { IOrganization } from "../interfaces/organization.interface";

const OrganizationSchema: Schema<IOrganization> = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Organization: Model<IOrganization> = mongoose.model(
  "Organization",
  OrganizationSchema
);
export default Organization;

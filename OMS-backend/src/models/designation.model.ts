import mongoose, { Schema, Model } from "mongoose";
import { IDesignation } from "../interfaces/designation.interface";

const DesignationSchema: Schema<IDesignation> = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Designation: Model<IDesignation> = mongoose.model(
  "Designation",
  DesignationSchema
);
export default Designation;

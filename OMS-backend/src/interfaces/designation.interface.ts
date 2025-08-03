import { Document } from "mongoose";

export interface IDesignation extends Document {
  name: string;
  description: string;
}

export interface DesignationInterface {
  name: string;
  description: string;
}
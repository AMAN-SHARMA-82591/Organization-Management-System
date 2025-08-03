import { Document } from "mongoose";

export interface IOrganization extends Document {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationInterface {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

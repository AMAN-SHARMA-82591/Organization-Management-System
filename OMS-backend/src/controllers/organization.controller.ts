import { NextFunction, Request, Response } from "express";
import { OrganizationInterface } from "../interfaces/organization.interface";
import Organization from "../models/organization.model";

export const getAllOrganizations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;
  try {
    const organizationList: OrganizationInterface[] | [] =
      await Organization.find();
    return res.status(200).json({
      success: true,
      message: "Fetched list of organization",
      data: organizationList,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id: string = req.params.id;
  try {
    const organizationData: OrganizationInterface | null =
      await Organization.findById({
        _id: id,
      });
    if (!organizationData)
      return res
        .status(404)
        .json({ success: false, message: "Organization not found." });
    res.status(200).json({
      success: true,
      message: "Fetched organization data.",
      data: organizationData,
    });
  } catch (error) {
    next(error);
  }
};

export const createOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, address, city, state, country } = req.body;
  try {
    const organizationData = await Organization.findOne({ name })
      .lean()
      .select("_id");
    if (organizationData) {
      return res.status(409).json({
        success: false,
        message: `Organization with name ${name} already exists. Please add some other name`,
      });
    }
    const newOrg: OrganizationInterface = await Organization.create({
      name,
      address,
      city,
      state,
      country,
    });
    res.status(201).json({
      success: true,
      message: "New organization created",
      data: newOrg,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrganization = (req: Request, res: Response) => {
  // const id = Number(req.params.id);
  // const index = organizations.findIndex((o) => o.id === id);
  // if (index === -1)
  //   return res.status(404).json({ message: "Organization not found." });
  // organizations[index] = { ...organizations[index], ...req.body };
  // res.json(organizations[index]);
};

export const deleteOrganization = (req: Request, res: Response) => {
  // const id = Number(req.params.id);
  // organizations = organizations.filter((o) => o.id !== id);
  // res.status(204).send();
};

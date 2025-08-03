import { NextFunction, Request, Response } from "express";
import { z } from "zod/v4";
import { DesignationInterface } from "../interfaces/designation.interface";
import Designation from "../models/designation.model";
import { validateSafeParse } from "../utils/validateRequest";
import { designationSchema } from "../validators/designationSchema";

export const getAllDesignations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;
  try {
    const designationList: DesignationInterface[] | [] =
      await Designation.find();
    return res.status(200).json({
      success: true,
      message: "Fetched list of designation",
      data: designationList,
    });
  } catch (error) {
    next(error);
  }
};

export const getDesignationById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id: string = req.params.id;
  try {
    const designationData: DesignationInterface | null =
      await Designation.findById({
        _id: id,
      });
    if (!designationData)
      return res
        .status(404)
        .json({ success: false, message: "Designation not found." });
    res.status(200).json({
      success: true,
      message: "Fetched designation data.",
      data: designationData,
    });
  } catch (error) {
    next(error);
  }
};

export const createDesignation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, description } = validateSafeParse<
    z.infer<typeof designationSchema>
  >(designationSchema, req);
  try {
    const designation = await Designation.findOne({ name })
      .lean()
      .select("_id");
    if (designation) {
      return res.status(409).json({
        success: false,
        message:
          "A designation with this name already exists. Please try again with a different designation.",
      });
    }
    const newDesig: DesignationInterface = await Designation.create({
      name,
      description,
    });
    res.status(201).json({
      success: true,
      message: "Designation successfully created.",
      data: newDesig,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDesignation = (req: Request, res: Response) => {
  // const id = Number(req.params.id);
  // const index = designations.findIndex((d) => d.id === id);
  // if (index === -1)
  //   return res.status(404).json({ message: "Designation not found." });
  // designations[index] = { ...designations[index], ...req.body };
  // res.json(designations[index]);
};

export const deleteDesignation = (req: Request, res: Response) => {
  // const id = Number(req.params.id);
  // designations = designations.filter((d) => d.id !== id);
  // res.status(204).send();
};

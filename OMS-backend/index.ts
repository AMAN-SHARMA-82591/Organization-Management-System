import express from "express";
import dotenv from 'dotenv';
import { connectDB } from "./config/db.ts";
dotenv.config();

const app: any = express();

const port: number = 5000;

await connectDB();
app.listen(port, (): void => {
  console.log("running...");
});

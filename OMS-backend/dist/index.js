import express from "express";
import dotenv from 'dotenv';
import { connectDB } from "./config/db.js";
dotenv.config();
const app = express();
const port = 5000;
await connectDB();
app.listen(port, () => {
    console.log("running...");
});

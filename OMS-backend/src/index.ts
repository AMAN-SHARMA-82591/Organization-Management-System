import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import setupRoutes from "./routes/index.ts";
import { connectDB } from "./config/db.ts";
dotenv.config();

const app: any = express();
const port: string | undefined = process.env.PORT;

app.use(
  cors({
    credentials: true,
  })
);
app.use(express.json());
const server = http.createServer(app);

setupRoutes(app);

async function startServer() {
  await connectDB();
  server.listen(port, async () => {
    console.log(`server running on port http://localhost:${port}`);
  });
}

startServer();
import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import setupRoutes from "./routes/index.ts";
import { connectDB } from "./config/db.ts";
import { errorHandler } from "./middlewares/error.middleware.ts";
dotenv.config();

const app: any = express();
const port: string | undefined = process.env.PORT;

app.use(helmet());
app.use(
  cors({
    credentials: true,
  })
);
app.use(express.json());
const server = http.createServer(app);

setupRoutes(app);

app.use(errorHandler);

async function startServer() {
  await connectDB();
  server.listen(port, async () => {
    console.log(`server running on port http://localhost:${port}`);
  });
}

startServer();

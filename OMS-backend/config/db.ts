import mongoose from "mongoose";

export async function connectDB() {
  try {
    const mongoUrl: string | undefined = process.env.MONGO_DB_URL;
    if (!mongoUrl) {
      throw new Error("MONGO_DB_URL environment variable is not defined");
    }
    await mongoose.connect(mongoUrl);
    console.log(`Connected to MongoDB (db: ${mongoUrl.split("/").pop()})`);
  } catch (error) {
    console.log(error);
    console.log("Could Not Connect to the Database");
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  await mongoose.disconnect();
  console.log("Database Disconnected!");
  process.exit(0);
});

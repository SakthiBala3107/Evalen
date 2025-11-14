import mongoose from "mongoose";
import ENV from "../lib/env.js";

const connectDB = async () => {
  try {
    if (!ENV?.DB_URL) {
      throw new Error("DB_URL is not defined in the ENV");
    }

    const conn = await mongoose.connect(ENV.DB_URL);
    console.log("Database connected --->", conn.connection.host);
  } catch (error) {
    console.log("Error connecting to Database", error);
    process?.exit(1);
  }
};

export default connectDB;

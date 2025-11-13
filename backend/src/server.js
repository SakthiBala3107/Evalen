import express from "express";
// import path from "path";
import ENV from "./lib/env.js";
import connectDB from "./database/database.js";

const app = express();
const PORT = ENV?.PORT || 3000;

//stuffs
// const __dirname = path.resolve();
// middlewares

// app.use(express.static(path.join(__dirname, "../frontend/dist")))

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log("server is connected to Port:", PORT));
  } catch (error) {
    console.error("Errror starting the server", error);
  }
};
startServer();

import express from "express";
import cors from "cors";
import ENV from "./lib/env.js";
import connectDB from "./database/database.js";
import { serve } from "inngest/express";
import { functions, inngest } from "./lib/inngest.js";
const app = express();
const PORT = ENV?.PORT || 3000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

app.use("/api/inngest", serve({ client: inngest, functions }));
// 1.58.47-> qadd our prodution apps url /api/inngest  in the inngest->apps->synce new app

app.get("/", (req, res) => {
  res.json({ mesg: "Your are in  homepage of Evalen " });
});

// SERVER
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log("server is connected to Port:", PORT));
  } catch (error) {
    console.error("Errror starting the server", error);
  }
};
startServer();

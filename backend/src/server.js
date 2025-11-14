import express from "express";
import cors from "cors";
import { serve } from "inngest/express";
import { functions, inngest } from "./lib/inngest.js";
import ENV from "./lib/env.js";
import connectDB from "./database/database.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

// Inngest API endpoint
app.use("/api/inngest", serve({ client: inngest, functions }));

// Test endpoint to send a dummy event
app.post("/api/test-inngest", async (req, res) => {
  try {
    const testEvent = {
      id: "test-id",
      email_addresses: [{ email_address: "test@example.com" }],
      first_name: "Test",
      last_name: "User",
      image_url: "",
    };

    await inngest.send({
      name: "clerk/user.created",
      data: testEvent,
    });

    res.json({ success: true, message: "Event sent to Inngest!" });
  } catch (err) {
    console.error("Error sending test event:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ msg: "API is up and running!" });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () =>
      console.log(`Server running on port: ${ENV.PORT}`)
    );
  } catch (err) {
    console.error("Error starting server:", err);
  }
};

startServer();

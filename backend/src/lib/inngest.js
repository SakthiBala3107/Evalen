import { Inngest } from "inngest";
import connectDB from "../database/database.js";
import User from "../models/User.model.js";
import ENV from "./env.js";

// Inngest client for production
export const inngest = new Inngest({
  id: "evalen",
  signingKey: ENV.INNGEST_SIGNING_KEY,
  eventKey: ENV.INNGEST_EVENT_KEY,
  mode: "cloud", // ensure cloud mode for deployed backend
});

// Sync user function (runs when Clerk creates a user)
export const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" }, // <-- correct event name
  async ({ event }) => {
    try {
      console.log("Event received in syncUser:", event.data);

      const dbConnected = await connectDB();
      if (!dbConnected) {
        console.error("MongoDB connection failed. Aborting user creation.");
        return;
      }

      const { id, email_addresses, first_name, last_name, image_url } =
        event.data;

      const newUser = {
        clerkId: id,
        email: email_addresses[0]?.email_address || "",
        name: `${first_name || ""} ${last_name || ""}`.trim(),
        profileImage: image_url || "",
      };

      console.log("Creating user in DB:", newUser);

      await User.create(newUser);
      console.log("User created successfully!");
    } catch (err) {
      console.error("Error in syncUser:", err);
    }
  }
);

// Delete user function
export const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" }, // make sure event matches Clerk
  async ({ event }) => {
    try {
      await connectDB();
      const { id } = event.data;
      await User.deleteOne({ clerkId: id });
      console.log("User deleted successfully:", id);
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  }
);

// Export all functions for Inngest
export const functions = [syncUser, deleteUserFromDB];

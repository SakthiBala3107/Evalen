import { Inngest } from "inngest";

import connectDB from "../database/database.js";
import User from "../models/User.model.js";
import ENV from "./env.js";

export const inngest = new Inngest({
  id: "evalen",
  signingKey: ENV.INNGEST_SIGNING_KEY,
  eventKey: ENV.INNGEST_EVENT_KEY,
});

// rest of your functions
const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.create" },
  async ({ event }) => {
    await connectDB();
    const { id, email_addresses, first_name, last_name, image_url } =
      event.data;
    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email_addresses,
      name: `${first_name || ""}${last_name || ""}`,
      profileImage: image_url,
    };
    await User.create(newUser);
  }
);

const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.delete" },
  async ({ event }) => {
    await connectDB();
    const { id } = event.data;
    await User.deleteOne({ clerkId: id });
  }
);

export const functions = [syncUser, deleteUserFromDB];

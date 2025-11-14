import { Inngest } from "inngest";
import connectDB from "../database/database.js";
import User from "../models/User.model.js";

export const inngest = new Inngest({ id: "evalen" });

const syncUser = inngest.createFunction(
  //   stuffs from inngest
  { id: "sync-user" },
  { event: "clerk/user.create" },
  //   our function
  async ({ event }) => {
    await connectDB();

    // user data get from the inngest
    const { id, email_addresses, first_name, last_name, image_url } =
      event.data;

    //   scheme input
    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email_addresses,
      name: `${first_name || ""}${last_name || ""}`,
      profileImage: image_url,
    };

    // create the new useraccording to the schema
    await User.create(newUser);
  }
);

//
const deleteUserFromDB = inngest.createFunction(
  //
  { id: "delete-user-from-db" },
  { event: "clerk/user.delete" },
  //   our function
  async ({ event }) => {
    await connectDB();

    //stuffs from inngest
    const { id } = event.data;

    //delegte user using id (clerkIds)
    await User.deleteOne({ clerkId: id });
  }
);

export const functions = [syncUser, deleteUserFromDB];

import { clerkClient, getAuth, requireAuth } from "@clerk/express";
import User from "../models/User.model.js";

export const ProtectRoute = [
  // if you rare un autheticated then it redircts the user to home

  requireAuth({ signInUrl: "/sign-in" }),
  //
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;

      if (!clerkId)
        return res
          .status(401)
          .json({ success: false, mesg: "Unauthorized - invalid token" });

      //if user exists then find the user from the DB
      const user = await User.findById({ clerkId });
      //  guard clause
      if (!user)
        return res.status(404).json({ success: false, mesg: "User not found" });

      //  if we got the user then we have to store in a foled req.user and pssing it to next  fuction->
      //attching user to req
      req.user = user;
      next(user);
    } catch (error) {
      console.error("Error in protectRoute middleware", error);
      next(error);
    }
  },
];

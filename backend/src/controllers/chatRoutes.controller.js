import { chatClient } from "../lib/stream.js";

export const getStreamToken = async (res, req) => {
  try {
    //why cletr id cuz we are passing our clerk id to the stream and other stuffs not the mongo db _id
    const token = chatClient.createToken(req.user.clerkId);

    res.status(200).json({
      success: true,
      token,
      data: {
        userId: req.user.clerkId,
        userName: req.user.name,
        userImage: req.user.image,
      },
    });
  } catch (error) {
    console.error("Error in getStreamToken controller", error.message);
    res.status(500).json({ message: "Internal server Error " });
  }
};

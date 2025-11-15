import { chatClient, streamClient } from "../lib/stream.js";
import Session from "../models/Session.model.js";

export const createSession = async (req, res) => {
  try {
    const { problem, difficulty } = req.body;

    const userId = req.user?._id;
    const clerkId = req.user?.clerkId;

    if (!(problem || difficulty))
      return resizeBy.status(400).json({
        success: false,
        message: "Problem and Diffculty are required",
      });
    //
    const callId = `Session_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}`;

    //SESSION CREATION IN DB   session creation using model
    const session = await Session.create({
      problem,
      difficulty,
      host: userId,
      callId,
    });

    // create  a streamclient
    await streamClient.video.call("default", callId).get({
      data: {
        created_by: clerkId,
        custom: { problem, difficulty, sessionId: session._id.toString() },
      },
    });

    //chat messaging
    const channel = chatClient.channel("messaging", callId, {
      name: `${problem} Session`,
      created_by_id: clerkId,
      members: [clerkId],
    });

    await channel.create();
    res.status(201).json({ success: true, session: session });

    //
  } catch (error) {
    console.log("Error in crateSession controller ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getActiveSession = async (_, res) => {
  try {
    const sessions = await Session.find({ status: "active" })
      .populate("host", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ success: true, sessions });
  } catch (error) {
    console.log("Error in ActiveSession controller ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getMyRecentSessions = async (req, res) => {
  try {
    const userId = req.user?._id;

    //get sessions where user is either host or particiopant
    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { participant: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(20);
    res.status(200).json({ success: true, sessions });
  } catch (error) {
    console.log("Error in getMyRecentSessions controller ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id)
      return res
        .status(404)
        .json({ success: false, message: "Enter valid Id" });

    const session = await Session.findById(id)
      .populate("host", "name email clerkId profileImage")
      .populate("participant", "name email clerkId profileImage");

    //   guard
    if (!session)
      return res
        .status(404)
        .json({ success: false, message: "Sesstion Not found" });

    res.status(200).json({ success: true, session });
  } catch (error) {
    console.log("Error in getSessionById controller ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const joinSession = async (res, req) => {
  try {
    const { id } = req.params;

    //
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    if (!id) return res.status(404).json({ message: "User not found" });

    const session = await Session.findById(id);

    // guard
    if (!session)
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });

    // if it does
    // check the room is full for our case max of 2peoples host and participant
    if (session.participant)
      return res
        .status(404)
        .json({ success: false, message: "Session is full" });

    // we have to assign the user as participant
    session.participant = userId;
    await session.save();

    //call the channle the video call
    const channel = chatClient.channel("messaging", session.callId);
    await channel?.addMembers([clerkId]);

    //
    res.status(200).json({ success: true, session });

    //
  } catch (error) {
    console.log("Error in joinSession controller ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const endSession = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    const session = await Session.findById(id);

    // guard clause
    if (!session)
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });

    // if the user is not a host then we never let him to end the session
    if (session.host != userId.toString())
      return res
        .status(403)
        .json({ success: false, message: "Only the host can end the session" });

    // if the session is already completed
    if (session.status === "completed")
      return res
        .status(400)
        .json({ success: false, message: "session is already completed" });

    //delete the channel[videocall]
    const call = streamClient.video.call("default", session.callId);
    await call.delete({ hard: true });

    // delete the chat[message]
    const channel = chatClient.channel("messaging", session.callId);
    await channel.delete();

    // everything is done then  yep

    // chnage the status
    session.status = "completed";
    await session.save();

    res
      .status(200)
      .json({ success: true, message: "Session Ended successfully" });

    //
  } catch (error) {
    console.log("Error in endSession controller ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

import { StreamChat } from "stream-chat";
import { StreamClient } from "@stream-io/node-sdk";
import ENV from "./env.js";

const apiKey = ENV.STREAM_API_KEY;
const apiSecretKey = ENV.STREAM_API_SECRET_KEY;

if (!apiKey || apiSecretKey) {
  console.error("STREAM API KEY OR STREAM API SECRET IS MISSING!");
}
// Instances

// for video calls
export const streamClient = new StreamClient(apiKey, apiSecretKey);

// for chat
export const chatClient = StreamChat.getInstance(apiKey, apiSecretKey);

// functions
export const upsertStreamUser = async (userData) => {
  try {
    await chatClient.upsertUser(userData);
    console.log("Stream user upserted successfully", userData);
  } catch (error) {
    console.error("Error upserting Stream user", error);
  }
};

export const deleteStreamUser = async (userId) => {
  try {
    await chatClient.deleteUser(userId);
    console.log("Strean user deleted successfully");
  } catch (error) {
    console.error("Error deleting Stream user", error);
  }
};

import dotenv from "dotenv";

// Load the .env file
dotenv.config();

const ENV = {
  DB_URL: process.env.DB_URL,
  DB_PASS: process.env.DB_PASS,
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_URL: process.env.CLIENT_URL,
  INGEST_EVENT_KEY: process.env.INGEST_EVENT_KEY,
  INGEST_SIGNING_KEY: process.env.INGEST_SIGNING_KEY,
  STREAM_API_KEY: process.env.STREAM_API_KEY,
  STREAM_API_SECRET_KEY: process.env.STREAM_API_SECRET_KEY,
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
};

export default ENV;

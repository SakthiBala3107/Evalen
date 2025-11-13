import dotenv from "dotenv";

// Load the .env file
dotenv.config();

const ENV = {
  DB_URL: process.env.DB_URL,
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
};

export default ENV;

import mongoose from "mongoose";
import logger from "./logger";
import { Config } from ".";

export const connectDatabase = async () => {
  try {
    const res = await mongoose.connect(Config.MONGO_URI);
    logger.info(`Connected to database: ${res.connection.name}`);
  } catch (error) {
    logger.error(`Error connecting to database: ${error}`);
    process.exit(1);
  }
};

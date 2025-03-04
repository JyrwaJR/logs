import { env } from "@/env";
import winston from "winston";
import "winston-mongodb";

// MongoDB connection URI
const mongoUri = env.DATABASE_URL;

// Function to create a logger dynamically per collection
export const createLogger = (collectionName: string) => {
  return winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
      new winston.transports.MongoDB({
        db: mongoUri,
        collection: collectionName, // Dynamic collection name
        level: "info",
      }),
    ],
  });
};

import { env } from "@/env";
import winston from "winston";
import "winston-mongodb";

const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
    new winston.transports.MongoDB({
      db: env.DATABASE_URL as string,
      options: { useNewUrlParser: true, useUnifiedTopology: true },
      collection: "logs", // Default collection name
      tryReconnect: true,
      metaKey: "metadata", // Store extra metadata
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
});

export default logger;

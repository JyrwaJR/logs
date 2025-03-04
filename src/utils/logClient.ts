import axios from "axios";

/**
 * Defines the structure for error log data.
 */
interface ErrorLogContext {
  user?: string;
  page?: string;
  componentStack?: string;
  additionalInfo?: Record<string, any>;
}

/**
 * Sends an error log to the backend API.
 * @param error - The error object.
 * @param context - Additional context about the error.
 */
export const logError = async (error: Error, context: ErrorLogContext = {}) => {
  try {
    await axios.post("/api/v2/log", {
      level: "error",
      message: error.message,
      stack: error.stack, // Include stack trace
      ...context, // Pass additional metadata (e.g., user, URL, etc.)
    });
  } catch (err) {
    console.error("Failed to send log to server:", err);
  }
};

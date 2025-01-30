export type ErrorLogT = {
  timestamp: string; // ISO 8601 format
  environment: "production" | "staging" | "development";
  applicationName: string; // Name of the frontend application
  pageUrl: string; // URL of the page where the error occurred
  errorType: string; // Error type (e.g., TypeError, NetworkError)
  errorMessage: string; // Error message
  stackTrace?: string; // Stack trace for debugging
  severity: "INFO" | "WARNING" | "ERROR" | "CRITICAL"; // Severity level of the error
  user?: {
    userId?: string; // ID of the user, if available
    userAgent?: string; // User's browser and device information
    sessionId?: string; // Session identifier
  };
  system?: {
    browserName?: string; // Browser name (e.g., Chrome, Firefox)
    browserVersion?: string; // Browser version
    operatingSystem?: string; // User's OS
    viewport?: string; // Screen dimensions (e.g., "1920x1080")
  };
  correlationId?: string; // ID to trace related logs or operations
  tags?: string[]; // Custom tags for categorization
};

export type MinFrontendErrorLogT = {
  timestamp: string; // ISO 8601 format
  environment: "production" | "staging" | "development" | "test";
  severity: "INFO" | "WARNING" | "ERROR" | "CRITICAL"; // Severity level of the error
  pageUrl: string; // URL of the page
  errorMessage: string; // Description of the error
  stackTrace?: string; // Stack trace, if available
  apiUrl: string;
  error?: unknown;
};

/**
 * Lightweight Logger Utility
 *
 * Provides structured logging with timestamps and log levels.
 * - `debug` is silenced when NODE_ENV === "production"
 * - Can be swapped for Winston / Pino later without changing call sites
 */

const isProduction = process.env.NODE_ENV === "production";

const timestamp = () => new Date().toISOString();

const logger = {
  info: (message, ...args) => {
    console.info(`[${timestamp()}] [INFO] ${message}`, ...args);
  },

  warn: (message, ...args) => {
    console.warn(`[${timestamp()}] [WARN] ${message}`, ...args);
  },

  error: (message, ...args) => {
    console.error(`[${timestamp()}] [ERROR] ${message}`, ...args);
  },

  debug: (message, ...args) => {
    if (!isProduction) {
      console.debug(`[${timestamp()}] [DEBUG] ${message}`, ...args);
    }
  },
};

export default logger;

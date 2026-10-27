/**
 * Canonical logger for the Soma backend.
 *
 * This is the ONLY logger module in the backend. Do not import winston directly;
 * import from here so all log lines carry the service label, file transport,
 * and consistent format.
 *
 * Usage:
 *   import { logger } from '@/shared/utils/logger';
 *   logger.info('message', { context });
 *
 *   Or for a sub-system label:
 *   import { createServiceLogger } from '@/shared/utils/logger';
 *   const log = createServiceLogger('automation');
 */
import winston from 'winston';

const isDev = process.env.NODE_ENV !== 'production';

const fileTransportOpts = {
  dirname: 'logs',
  maxsize: 10 * 1024 * 1024, // 10 MB
  maxFiles: 5,
};

export const createServiceLogger = (serviceName: string): winston.Logger => {
  const transports: winston.transport[] = [
    new winston.transports.File({
      ...fileTransportOpts,
      filename: `${serviceName}.log`,
    }),
    new winston.transports.File({
      ...fileTransportOpts,
      filename: `${serviceName}-error.log`,
      level: 'error',
    }),
  ];

  if (isDev) {
    transports.push(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      })
    );
  }

  return winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    defaultMeta: { service: serviceName },
    transports,
  });
};

/** Root logger — use this in routes, middleware, and services. */
export const logger = createServiceLogger('soma-backend');

// Guard: Attach console transport to root winston container so any direct
// winston.log / winston.info calls never trigger "Attempt to write logs with no transports"
try {
  winston.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
      level: process.env.LOG_LEVEL || 'info',
    })
  );
} catch {
  // Ignore if already initialized
}

export default logger;

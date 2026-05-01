/**
 * Simple logging utility for tracking events and errors.
 * In a production environment, this could be extended to send logs to 
 * services like Sentry, LogRocket, or a custom backend endpoint.
 */

type LogLevel = 'info' | 'warn' | 'error';

const logger = {
  info: (message: string, data?: any) => {
    log('info', message, data);
  },
  warn: (message: string, data?: any) => {
    log('warn', message, data);
  },
  error: (message: string, data?: any) => {
    log('error', message, data);
  },
  
  // Specific event for checkout conversion tracking
  trackCheckout: (step: string, data?: any) => {
    log('info', `Checkout Step: ${step}`, data);
    // Future: Send to GA4, Pixel, etc.
  }
};

function log(level: LogLevel, message: string, data?: any) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

  if (level === 'error') {
    console.error(logMessage, data || '');
  } else if (level === 'warn') {
    console.warn(logMessage, data || '');
  } else {
    console.log(logMessage, data || '');
  }
}

export default logger;

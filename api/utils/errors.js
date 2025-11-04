/**
 * Error Handling Utilities
 * Standardized error responses and logging
 */

/**
 * Standard error response format
 */
export class ApiError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'ApiError';
  }
}

/**
 * Common error types
 */
export const ErrorTypes = {
  RATE_LIMIT_EXCEEDED: {
    code: 'RATE_LIMIT_EXCEEDED',
    statusCode: 429,
    message: 'Rate limit exceeded. You can only perform 3 audits per day.'
  },
  INVALID_URL: {
    code: 'INVALID_URL',
    statusCode: 400,
    message: 'Invalid Psychology Today profile URL.'
  },
  INVALID_EMAIL: {
    code: 'INVALID_EMAIL',
    statusCode: 400,
    message: 'Invalid email address.'
  },
  AUDIT_NOT_FOUND: {
    code: 'AUDIT_NOT_FOUND',
    statusCode: 404,
    message: 'Audit not found or has expired.'
  },
  AUDIT_EXPIRED: {
    code: 'AUDIT_EXPIRED',
    statusCode: 410,
    message: 'This audit has expired. Please generate a new one.'
  },
  PDF_EXPIRED: {
    code: 'PDF_EXPIRED',
    statusCode: 410,
    message: 'PDF access has expired. Pay $4.99 to regenerate.'
  },
  SCRAPING_FAILED: {
    code: 'SCRAPING_FAILED',
    statusCode: 500,
    message: 'Failed to scrape Psychology Today profile. Please verify the URL is correct.'
  },
  CLAUDE_API_ERROR: {
    code: 'CLAUDE_API_ERROR',
    statusCode: 500,
    message: 'Failed to generate audit. Please try again.'
  },
  PAYMENT_REQUIRED: {
    code: 'PAYMENT_REQUIRED',
    statusCode: 402,
    message: 'Payment required to access full audit.'
  },
  PAYMENT_FAILED: {
    code: 'PAYMENT_FAILED',
    statusCode: 402,
    message: 'Payment processing failed. Please try again.'
  },
  WEBHOOK_VERIFICATION_FAILED: {
    code: 'WEBHOOK_VERIFICATION_FAILED',
    statusCode: 401,
    message: 'Webhook signature verification failed.'
  },
  MISSING_PARAMETER: {
    code: 'MISSING_PARAMETER',
    statusCode: 400,
    message: 'Required parameter is missing.'
  },
  DATABASE_ERROR: {
    code: 'DATABASE_ERROR',
    statusCode: 500,
    message: 'Database operation failed. Please try again.'
  }
};

/**
 * Create an error response
 * @param {Error|ApiError} error - The error object
 * @returns {Object} Formatted error response
 */
export function createErrorResponse(error) {
  // If it's already an ApiError, use its properties
  if (error instanceof ApiError) {
    return {
      error: {
        code: error.code,
        message: error.message,
        statusCode: error.statusCode
      }
    };
  }

  // For unknown errors, return generic 500
  console.error('Unhandled error:', error);
  return {
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred. Please try again.',
      statusCode: 500
    }
  };
}

/**
 * Handle errors in Vercel serverless functions
 * @param {Response} res - The response object
 * @param {Error|ApiError} error - The error object
 */
export function handleError(res, error) {
  const errorResponse = createErrorResponse(error);
  const statusCode = errorResponse.error.statusCode;

  return res.status(statusCode).json(errorResponse);
}

/**
 * Validate required parameters
 * @param {Object} params - The parameters object
 * @param {string[]} requiredFields - Array of required field names
 * @throws {ApiError} If any required field is missing
 */
export function validateRequired(params, requiredFields) {
  for (const field of requiredFields) {
    if (!params[field]) {
      throw new ApiError(
        `Missing required parameter: ${field}`,
        ErrorTypes.MISSING_PARAMETER.statusCode,
        ErrorTypes.MISSING_PARAMETER.code
      );
    }
  }
}

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} True if valid
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Psychology Today profile URL
 * @param {string} url - The URL to validate
 * @returns {boolean} True if valid
 */
export function isValidPsychologyTodayUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('psychologytoday.com') &&
           urlObj.pathname.includes('/profile/');
  } catch {
    return false;
  }
}

/**
 * Get client IP address from request
 * @param {Request} req - The request object
 * @returns {string} The IP address
 */
export function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0] ||
         req.headers['x-real-ip'] ||
         req.connection?.remoteAddress ||
         'unknown';
}

/**
 * Log API request for monitoring
 * @param {string} endpoint - The endpoint name
 * @param {Object} data - Request data
 */
export function logRequest(endpoint, data = {}) {
  console.log(`[${new Date().toISOString()}] ${endpoint}`, {
    ...data,
    // Sanitize sensitive data
    email: data.email ? data.email.replace(/(.{2})(.*)(@.*)/, '$1***$3') : undefined
  });
}
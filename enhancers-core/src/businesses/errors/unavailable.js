const { ERROR_CODES, ERROR_MESSAGES } = require('../../constants/constants');

class BusinessesUnavailableError extends Error {
  constructor(message = ERROR_MESSAGES.BUSINESS_UNAVAILABLE) {
    super(message);
    this.errorCode = ERROR_CODES.BUSINESS_UNAVAILABLE;
    this.errorMessage = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { BusinessesUnavailableError };

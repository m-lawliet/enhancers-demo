const { ERROR_CODES, ERROR_MESSAGES } = require('../../constants/constants');

class LocationNotFoundError extends Error {
  constructor(message = ERROR_MESSAGES.LOCATION_NOT_FOUND) {
    super(message);
    this.errorCode = ERROR_CODES.LOCATION_NOT_FOUND;
    this.errorMessage = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { LocationNotFoundError };

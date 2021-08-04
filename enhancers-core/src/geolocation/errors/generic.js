const { ERROR_CODES, ERROR_MESSAGES } = require('../../constants/constants');

class LocationGenericError extends Error {
  constructor(message = ERROR_MESSAGES.LOCATION_GENERIC) {
    super(message);
    this.errorCode = ERROR_CODES.LOCATION_GENERIC;
    this.errorMessage = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { LocationGenericError };

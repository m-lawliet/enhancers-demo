const { ERROR_CODES } = require('../../constants/constants');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.status = 400;
    this.errorCode = ERROR_CODES.BAD_REQUEST;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { BadRequestError };

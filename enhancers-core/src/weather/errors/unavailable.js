const { ERROR_CODES, ERROR_MESSAGES } = require('../../constants/constants');

class WeatherUnavailableError extends Error {
  constructor(message = ERROR_MESSAGES.WEATHER_UNAVALIABLE) {
    super(message);
    this.errorCode = ERROR_CODES.WEATHER_UNAVALIABLE;
    this.errorMessage = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { WeatherUnavailableError };

const ERROR_CODES = Object.freeze({
  DEFAULT: '10000',
  BAD_REQUEST: '100400',
  NOT_FOUND: '100404',
  LOCATION_GENERIC: '200000',
  LOCATION_NOT_FOUND: '200404',
  WEATHER_UNAVALIABLE: '300404',
  BUSINESS_UNAVAILABLE: '400404',
});

const ERROR_MESSAGES = Object.freeze({
  LOCATION_NOT_FOUND: 'Location not found',
  LOCATION_GENERIC: 'Location generic error',
  WEATHER_UNAVALIABLE: 'Weather unavailable',
  BUSINESS_UNAVAILABLE: 'Business unavailable',
});

const DEFAULT_RESPONSES = Object.freeze({
  OK: 'Ok',
  BAD_REQUEST: 'Bad request',
});

module.exports = {
  ERROR_CODES,
  ERROR_MESSAGES,
  DEFAULT_RESPONSES,
};

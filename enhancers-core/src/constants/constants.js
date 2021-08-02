const ERROR_CODES = Object.freeze({
  DEFAULT: '10000',
  NOT_FOUND: '100404',
});

const DEFAULT_RESPONSES = Object.freeze({
  OK: 'Ok',
});

const DEFAULT_GEOLOCATION = Object.freeze({
  LIMIT: 1,
  LANGUAGE: 'en',
});

module.exports = {
  ERROR_CODES,
  DEFAULT_RESPONSES,
  DEFAULT_GEOLOCATION,
};

const ERROR_CODES = Object.freeze({
  DEFAULT: '10000',
  NOT_FOUND: '100404',
});

const DEFAULT_RESPONSES = Object.freeze({
  OK: 'Ok',
});

const DEFAULT_APIS = Object.freeze({
  LOCALE: 'en',
  UNITS: 'metric',
  LIMIT_LOCATIONS: 1,
  LIMIT_BUSINESSES: 20,
});

module.exports = {
  ERROR_CODES,
  DEFAULT_RESPONSES,
  DEFAULT_APIS,
};

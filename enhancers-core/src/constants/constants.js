const ERROR_CODES = Object.freeze({
  DEFAULT: '10000',
  BAD_REQUEST: '100400',
  NOT_FOUND: '100404',
});

const DEFAULT_RESPONSES = Object.freeze({
  OK: 'Ok',
  BAD_REQUEST: 'Bad request',
});

module.exports = {
  ERROR_CODES,
  DEFAULT_RESPONSES,
};

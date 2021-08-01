const { ERROR_CODES, DEFAULT_RESPONSES } = require('../../constants/constants');

function notFound() {
  return function notFoundMiddleware() {
    const error = new Error('Not Found');
    error.status = 404;
    error.code = ERROR_CODES.NOT_FOUND;
    throw error;
  };
}

function ok() {
  return function okMiddleware(req, res) {
    const data = res.locals.body || DEFAULT_RESPONSES.OK;
    res.status(200);
    res.send(data);
  };
}

module.exports = {
  notFound,
  ok,
};

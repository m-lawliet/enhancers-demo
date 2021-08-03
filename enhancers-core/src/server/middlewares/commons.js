const { ERROR_CODES } = require('../../constants/constants');

function errorHandler() {
  return async function errorHandlerMiddleware(err, req, res, next) {
    const { id } = res.locals;
    const status = err.statusCode || err.status || 500;
    const category = Math.floor(status / 100);

    // NOTE: avoid sending details of crash if caused by internal bugs
    // but I want to notify correctly 503 Service Unavailable too
    const errorCode = err.code || ERROR_CODES.DEFAULT;
    const errorDescription = (category !== 5 || status === 503) ? err.message : 'Internal Server Error';
    const error = (category === 4 || status === 503) ? err.message : err.stack;

    res.locals.logger = res.locals.logger.child({ error, errorCode, errorDescription });

    res.status(status);
    res.send({
      id,
      errorCode,
      errorDescription,
    });
  };
}

module.exports = {
  errorHandler,
};

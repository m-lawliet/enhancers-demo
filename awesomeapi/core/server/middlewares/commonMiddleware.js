const { ERROR_CODES } = require('../../constants/constants');

function errorHandler() {
  return async function errorHandlerMiddleware(err, req, res, next) {
    const startTime = Date.now();
    const status = err.statusCode || err.status || 500;
    const category = Math.floor(status / 100);
    const responseTime = `${Math.ceil(Date.now() - startTime)}ms`;

    // NOTE: avoid sending details of crash if caused by internal bugs
    // but i want to notify correctly 503 Service Unavailable too
    const errorCode = err.code || ERROR_CODES.DEFAULT;
    const errorDescription = (category !== 5 || status === 503) ? err.message : 'Internal Server Error';
    const error = (category === 4 || status === 503) ? err.message : err.stack;

    // NOTE: log stack only if not "400 category" or 503 error
    res.locals.logger = res.locals.logger.child({ status, responseTime, error });
    res.locals.logger.error('Failed request');

    res.status(status);
    res.send({
      errorCode,
      errorDescription,
    });
  };
}

module.exports = {
  errorHandler,
};

const { v1: uuidV1 } = require('uuid');

function initializeLog(logger) {
  return function prepareLogMetadataMiddleware(req, res, next) {
    const id = uuidV1();
    const forwarded = req.headers['X-FORWARDED-FOR'];
    let source = req.ip;
    if (forwarded) source += forwarded.split(',').join('-->');
    res.locals.id = id;
    res.locals.logger = logger.child({ id, source });
    next();
  };
}

function logRequestHeadersOn({ level = 'debug', always = false }) {
  return function logHeadersMiddleware(req, res, next) {
    const { headers } = req;
    const { logger } = res.locals;
    const currentLevel = logger.levels[logger.level];
    const minimumLevel = logger.levels[level];
    if (currentLevel >= minimumLevel || always) {
      res.locals.logger = logger.child({ headers });
    }
    next();
  };
}

function logRequestBodyOn({ level = 'debug', always = false }) {
  return function logBodyMiddleware(req, res, next) {
    const { body: requestBody } = req;
    const { logger } = res.locals;
    const currentLevel = logger.levels[logger.level];
    const minimumLevel = logger.levels[level];
    if (currentLevel >= minimumLevel || always) {
      res.locals.logger = logger.child({ requestBody });
    }
    next();
  };
}

function logResponseBodyOn({ level = 'debug', always = false }) {
  return function logResponseBodyMiddleware(req, res, next) {
    const { body: responseBody } = res;
    const { logger } = res.locals;
    const currentLevel = logger.levels[logger.level];
    const minimumLevel = logger.levels[level];
    if (currentLevel >= minimumLevel || always) {
      res.locals.logger = logger.child({ responseBody });
    }
    next();
  };
}

function logRequest() {
  return function logRequestMiddleware(req, res, next) {
    const { url, method } = req;
    res.locals.logger = res.locals.logger.child({ url, method });
    res.locals.logger.debug('Received request');
    const startTime = Date.now();

    next();

    // NOTE: Log completed request message only if is not an error
    // (log will be performed by errorHandler in such case)
    const { statusCode: status } = res;
    const category = Math.floor(status / 100);
    const responseTime = `${Math.ceil(Date.now() - startTime)}ms`;
    res.locals.logger = res.locals.logger.child({ status, responseTime });
    if (category === 2) res.locals.logger.http('Completed request');
    else res.locals.logger.error('Failed request');
  };
}

module.exports = {
  initializeLog,
  logRequestHeadersOn,
  logRequestBodyOn,
  logResponseBodyOn,
  logRequest,
};

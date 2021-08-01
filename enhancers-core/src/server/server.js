const express = require('express');
const defaultMiddlewares = require('./middlewares');

const configSchema = require('./schemas/baseServerConfig.json');

class Server {
  constructor(config, shared = {}) {
    const label = 'server';
    const { address, port, prefix } = config;
    this.customMiddlewares = shared.customMiddlewares || {};
    this.logger = shared.logger.child({ label });
    this.validator = shared.validator;
    this.validator.addSchema('serverConfig', configSchema);
    this.validator.ensure('serverConfig', config);
    this.middlewares = {};
    this.prepareMiddlewares();
    this.initialMiddlewares = [];
    this.errorMiddlewares = [];
    this.userMiddlewares = [];
    this.finalMiddlewares = [];
    this.address = address;
    this.port = port;
    this.prefix = prefix;
    this.app = express();
    this.server = null;
  }

  prepareMiddlewares() {
    Object.keys(defaultMiddlewares).forEach((group) => {
      this.middlewares[group] = { ...defaultMiddlewares[group], ...this.customMiddlewares[group] };
    });
  }

  initializeMiddlewares() {
    const { logger, middlewares } = this;
    const { logs, commons, replies } = middlewares;
    this.initialMiddlewares.push(
      logs.initializeLog(logger),
      // TODO: Make those configurable on config file
      logs.logRequestHeadersOn({ level: 'debug' }),
      logs.logRequestBodyOn({ level: 'debug' }),
      logs.logResponseBodyOn({ level: 'debug' }),
      logs.logRequest(),
    );
    this.errorMiddlewares.push(commons.errorHandler());
    this.finalMiddlewares.push(replies.notFound());
  }

  addUserMiddlewares(userMiddlewares) {
    this.userMiddlewares.push(...userMiddlewares);
  }

  async start() {
    const { address, port, prefix } = this;
    const logger = this.logger.child({ address, port, prefix });
    logger.debug('Server starting...');
    this.server = this.app.listen(port, address);
    this.initializeMiddlewares();
    this.app.use(
      ...this.initialMiddlewares,
      ...this.userMiddlewares,
      ...this.finalMiddlewares,
      ...this.errorMiddlewares,
    );
    this.server.on('error', (error) => {
      logger.error('On server start occurred error', { error });
    });
    logger.info('Server started.');
  }

  async stop() {
    const { server, address, port, prefix } = this;
    const logger = this.logger.child({ address, port, prefix });
    if (server) {
      logger.debug('Server closing...');
      await server.close();
      logger.info('Server closed.');
    }
  }
}

module.exports = { Server };

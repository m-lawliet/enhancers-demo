const express = require('express');
const helmet = require('helmet');
const defaultMiddlewares = require('./middlewares');

const configSchema = require('./schemas/baseServerConfig.json');

class Server {
  constructor(config, shared = {}) {
    const label = 'server';
    const { address, port, prefix } = config;
    this.customMiddlewares = shared.customMiddlewares || {};
    this.userMiddlewares = [];
    this.logger = shared.logger.child({ label });
    this.validator = shared.validator;
    this.validator.addSchema('serverConfig', configSchema);
    this.validator.ensure('serverConfig', config);
    this.middlewares = {};
    this.initializeMiddlewares();
    this.address = address;
    this.port = port;
    this.prefix = prefix;
    this.app = express();
    this.server = null;
    this.started = false;
  }

  initializeMiddlewares() {
    Object.keys(defaultMiddlewares).forEach((group) => {
      this.middlewares[group] = { ...defaultMiddlewares[group], ...this.customMiddlewares[group] };
    });
  }

  async addUserMiddlewares(userMiddlewares) {
    const addedMiddlewares = Array.isArray(userMiddlewares) ? userMiddlewares : [userMiddlewares];
    this.userMiddlewares.push(...addedMiddlewares);
    if (this.started) await this.restart();
  }

  async start() {
    const { address, port, prefix, middlewares } = this;
    const { logs, commons, replies } = middlewares;
    const logger = this.logger.child({ address, port, prefix });
    logger.debug('Server starting...');

    this.server = this.app.listen(port, address);
    this.app.use(
      helmet(),
      logs.logInitialize(logger),
      // TODO: Make those configurable on config file
      logs.logRequestHeadersOn({ level: 'debug' }),
      logs.logRequestBodyOn({ level: 'debug' }),
      logs.logResponseBodyOn({ level: 'debug' }),
      logs.logRequest(),
      ...this.userMiddlewares,
      replies.notFound(),
      commons.errorHandler(),
    );
    this.server.on('error', (error) => {
      logger.error('On server start occurred error', { error });
    });
    this.started = true;

    logger.info('Server started.');
  }

  // TODO: Check if stop works correctly
  async stop() {
    const { server, address, port, prefix } = this;
    const logger = this.logger.child({ address, port, prefix });
    if (server) {
      logger.debug('Server closing...');
      await server.close();
      this.started = false;
      logger.info('Server closed.');
    }
  }

  async restart() {
    await this.stop();
    await this.start();
  }
}

module.exports = { Server };

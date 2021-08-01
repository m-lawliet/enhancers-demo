const { Configurator, Logger, Validator, Server } = require('enhancers-core');

const { name: appName } = require('../package.json');

async function run() {
  const validator = new Validator();
  const configurator = new Configurator({ appName });
  const config = configurator.getAll();
  const logger = new Logger(config.logger, { validator });
  const server = new Server(config.server, { validator, logger });
  await server.start();
  await server.stop();
}

run().then();
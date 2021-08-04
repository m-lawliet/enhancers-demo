const {
  Configurator,
  Logger,
  GeolocationService,
  WeatherService,
  BusinessesService,
} = require('enhancers-core');

const { Validator } = require('./validator/validator');
const { Server } = require('./server/server');

const { name: appName } = require('../package.json');

async function run() {
  const validator = new Validator();
  const configurator = new Configurator({ appName });
  const config = configurator.getAll();
  const logger = new Logger(config.logger, { validator });
  const geolocationService = new GeolocationService(config.geolocation, { validator, logger });
  const weatherService = new WeatherService(config.weather, { validator, logger });
  const businessesService = new BusinessesService(config.businesses, { validator, logger });

  const server = new Server(config.server, {
    validator,
    logger,
    geolocationService,
    weatherService,
    businessesService,
  });
  await server.start();
}

run().then();

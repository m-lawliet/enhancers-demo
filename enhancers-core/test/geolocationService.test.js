const { Validator, Logger, Configurator } = require('../src');
const { GeolocationService } = require('../src/geolocation/geolocationService');

const run = async () => {
  const appName = 'testGeolocation';
  const validator = new Validator();
  const configurator = new Configurator({ appName });
  const config = configurator.getAll();
  const logger = new Logger(config.logger, { validator });
  const geolocation = new GeolocationService(config.geolocation, { validator, logger });
  const location = 'Madrid';
  const result = await geolocation.getLocationByName(location);
  console.log(result);
};

run().then();

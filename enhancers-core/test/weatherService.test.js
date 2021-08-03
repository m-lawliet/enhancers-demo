const { Validator, Logger, Configurator, GeolocationService, WeatherService } = require('../src');

const run = async () => {
  const appName = 'testWeather';
  const validator = new Validator();
  const configurator = new Configurator({ appName });
  const config = configurator.getAll();
  const logger = new Logger(config.logger, { validator });
  const weather = new WeatherService(config.weather, { validator, logger });
  const geolocation = new GeolocationService(config.geolocation, { validator, logger });

  const location = 'Madrid';
  const lang = 'it';
  const { lat, lon } = await geolocation.getLocationByName(location, { lang });
  const result = await weather.getWeather(lat, lon, { lang });
  console.log(result);
};

run().then();

const {
  Validator,
  Logger,
  Configurator,
  GeolocationService,
  WeatherService,
  BusinessesService,
} = require('../src');

const run = async () => {
  const appName = 'testWeather';
  const validator = new Validator();
  const configurator = new Configurator({ appName });
  const config = configurator.getAll();
  const logger = new Logger(config.logger, { validator });
  const weatherService = new WeatherService(config.weather, { validator, logger });
  const geolocationService = new GeolocationService(config.geolocation, { validator, logger });
  const businessService = new BusinessesService(config.businesses, { validator, logger });

  const location = 'Madrid';
  const locale = 'it_IT';
  const [lang] = locale.split('_');
  const geo = await geolocationService.getLocationByName(location, { lang });
  const { lat, lon } = geo;
  const weather = await weatherService.getWeather(lat, lon, { lang });
  const businesses = await businessService.searchBusinesses(lat, lon, { locale });
  const result = {
    geo,
    weather,
    businesses,
  };
  console.log(result);
};

run().then();

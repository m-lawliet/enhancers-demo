const axios = require('axios');

const configSchema = require('./schemas/geolocationServiceConfig.json');
const { LocationNotFoundError, LocationGenericError } = require('./errors');

class GeolocationService {
  constructor(config, shared) {
    const label = 'geo';
    this.logger = shared.logger.child({ label });
    this.validator = shared.validator;
    this.validator.addSchema(label, configSchema);
    this.validator.ensure(label, config);
    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL;
    this.timeout = config.timeout;
    const { baseURL, timeout } = this;
    this.axios = axios.create({ baseURL, timeout });
  }

  async getLocationsByName(name, options = {}) {
    let locations;
    const url = '/direct';
    const { apiKey: appid } = this;
    const { id, limit, lang } = options;
    const logger = this.logger.child({ id, name, limit, lang });
    const startTime = Date.now();

    try {
      logger.debug('Retrieving locations...');

      const params = { q: name, limit, appid };
      const { data } = await this.axios.get(url, { params });

      if (!data.length) throw new LocationNotFoundError();
      locations = data.map((result) => (
        {
          name: (result.local_names && result.local_names[lang]) || result.name,
          country: result.country,
          state: result.state,
          lat: result.lat,
          lon: result.lon,
        }
      ));

      const responseTime = `${Math.ceil(Date.now() - startTime)}ms`;
      logger.debug('Retrieved locations', { responseTime });
    } catch (error) {
      const responseTime = `${Math.ceil(Date.now() - startTime)}ms`;
      logger.error('Cannot retrieve locations', { responseTime, error });

      // NOTE: Do not throw error here, I never want this function to throw
      locations = [error.errorCode ? error : new LocationGenericError()];
    }
    return locations;
  }

  async getLocationByName(name, options = {}) {
    const { id, lang } = options;
    const limit = 1;
    const [location] = await this.getLocationsByName(name,{ id, limit, lang });
    return location;
  }
}

module.exports = { GeolocationService };

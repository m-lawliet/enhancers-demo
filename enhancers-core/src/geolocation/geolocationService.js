const axios = require('axios');

const configSchema = require('./schemas/geolocationServiceConfig.json');
const { DEFAULT_APIS } = require('../constants/constants');

class GeolocationService {
  constructor(config, shared) {
    const label = 'geo';
    this.logger = shared.logger.child({ label });
    this.validator = shared.validator;
    this.validator.addSchema(label, configSchema);
    this.validator.ensure(label, config);
    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL;
    this.apiURL = config.apiURL;
    this.timeout = config.timeout;
    const { baseURL, timeout } = this;
    this.axios = axios.create({ baseURL, timeout });
  }

  async getLocationsByName(name, options = {}) {
    let results = [];
    const { apiKey: appid, apiURL: url } = this;
    const {
      id,
      limit = DEFAULT_APIS.LIMIT_LOCATIONS,
      lang = DEFAULT_APIS.LANGUAGE,
    } = options;
    const logger = this.logger.child({ id, name, limit, lang });
    const params = { q: name, limit, appid };

    try {
      logger.debug('Retrieving locations...');
      const { data } = await this.axios.get(url, { params });
      results = data.map((result) => (
        {
          name: result.local_names[lang] || result.name,
          country: result.country,
          state: result.state,
          lat: result.lat,
          lon: result.lon,
        }
      ));
      logger.debug('Retrieved locations');
    } catch (error) {
      logger.error('Cannot retrieve locations', { error });
      throw error;
    }
    return results;
  }

  async getLocationByName(name, options = {}) {
    const { id, lang } = options;
    const limit = 1;
    const [location] = await this.getLocationsByName(name,{ id, limit, lang });
    return location;
  }
}

module.exports = { GeolocationService };

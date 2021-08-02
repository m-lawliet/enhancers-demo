const axios = require('axios');

const configSchema = require('./schemas/geolocationServiceConfig.json');

class GeolocationService {
  constructor(config, shared) {
    this.logger = shared.logger.child({ label: 'geo' });
    this.validator = shared.validator;
    this.validator.addSchema('geolocation', configSchema);
    this.validator.ensure('geolocation', config);
    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL;
    this.directGeocodingURL = config.directGeocodingURL;
    this.timeout = config.timeout;
    const { baseURL, timeout } = this;
    this.axios = axios.create({ baseURL, timeout });
  }

  // TODO: Add log
  async getLocationByName(name, options = {}) {
    const { limit = 1 } = options;
    const { apiKey: appid, directGeocodingURL: url } = this;
    const params = { q: name, limit, appid };
    return this.axios.get(url, { params });
  }
}

module.exports = { GeolocationService };

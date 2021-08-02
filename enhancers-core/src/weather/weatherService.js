const axios = require('axios');

const configSchema = require('./schemas/weatherServiceConfig.json');
const { DEFAULT_APIS } = require('../constants/constants');

class WeatherService {
  constructor(config, shared) {
    const label = 'weather';
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

  async getWeather(lat, lon, options = {}) {
    let weather = {};
    const { apiKey: appid, apiURL: url } = this;
    const {
      id,
      units = DEFAULT_APIS.UNITS,
      lang = DEFAULT_APIS.LANGUAGE,
    } = options;
    const logger = this.logger.child({ id, units, lang, lat, lon });
    const params = { lat, lon, units, lang, appid };

    try {
      logger.debug('Retrieving weather...');
      const { data } = await this.axios.get(url, { params });
      weather = data;
      logger.debug('Retrieved weather');
    } catch (error) {
      logger.error('Cannot retrieve weather', { error });
      throw error;
    }
    return weather;
  }
}

module.exports = { WeatherService };

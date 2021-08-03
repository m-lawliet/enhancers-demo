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
    this.timeout = config.timeout;
    const { baseURL, timeout } = this;
    this.axios = axios.create({ baseURL, timeout });
  }

  async getWeather(lat, lon, options = {}) {
    let weather = {};
    const url = '/onecall';
    const { apiKey: appid } = this;
    const defaultUnits = DEFAULT_APIS.UNITS;
    const [defaultLanguage] = DEFAULT_APIS.LOCALE.split('_');
    const { id, units = defaultUnits, lang = defaultLanguage } = options;
    const logger = this.logger.child({ id, units, lang, lat, lon });
    const startTime = Date.now();

    try {
      logger.debug('Retrieving weather...');
      const params = { lat, lon, units, lang, appid };
      const { data } = await this.axios.get(url, { params });
      weather = data;
      const responseTime = `${Math.ceil(Date.now() - startTime)}ms`;
      logger.debug('Retrieved weather', { responseTime });
    } catch (error) {
      const responseTime = `${Math.ceil(Date.now() - startTime)}ms`;
      logger.error('Cannot retrieve weather', { responseTime, error });
      throw error;
    }
    return weather;
  }
}

module.exports = { WeatherService };

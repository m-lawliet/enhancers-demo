const axios = require('axios');
const LRUCache = require('lru-cache');
const { retryAdapterEnhancer, cacheAdapterEnhancer, throttleAdapterEnhancer } = require('axios-extensions');

const { startTimer } = require('../tools/tools');
const { WeatherUnavailableError } = require('./errors');
const configSchema = require('./schemas/weatherServiceConfig.json');

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
    this.retryTimes = config.retryTimes;
    this.maxCacheAge = config.maxCacheAge;
    this.maxCacheItems = config.maxCacheItems;
    this.thresholdThrottle = config.thresholdThrottle;

    const {
      baseURL,
      timeout,
      retryTimes,
      maxCacheItems: max,
      maxCacheAge: maxAge,
      thresholdThrottle: threshold,
    } = this;
    const defaultCache = new LRUCache({ max, maxAge });

    // NOTE: This chaining seems a little clunky, but is recommended on axios-extensions.
    // Consider if a better alternative exists
    const adapter =
      retryAdapterEnhancer(
        throttleAdapterEnhancer(
          cacheAdapterEnhancer(axios.defaults.adapter),
          { threshold, retryTimes, defaultCache },
        ),
      );

    this.axios = axios.create({ baseURL, timeout, adapter });
  }

  async getWeather(lat, lon, options = {}) {
    let weather = {};
    const url = '/onecall';
    const { apiKey: appid } = this;
    const { id, units, lang } = options;
    const logger = this.logger.child({ id, units, lang, lat, lon });
    const getElapsedTime = startTimer();

    try {
      logger.debug('Retrieving weather...');

      if (lat === undefined || lon === undefined) throw new WeatherUnavailableError();
      const params = { lat, lon, units, lang, appid };
      const { data } = await this.axios.get(url, { params });
      weather = data;

      const responseTime = getElapsedTime();
      logger.debug('Retrieved weather', { responseTime });
    } catch (error) {
      const responseTime = getElapsedTime();
      logger.error('Cannot retrieve weather', { responseTime, error });

      weather = error.errorCode ? error : new WeatherUnavailableError();
    }
    return weather;
  }
}

module.exports = { WeatherService };

const axios = require('axios');

const { startTimer } = require('../tools/tools');
const { BusinessesUnavailableError } = require('./errors');
const configSchema = require('./schemas/businessesServiceConfig.json');

class BusinessesService {
  constructor(config, shared) {
    const label = 'businesses';
    this.logger = shared.logger.child({ label });
    this.validator = shared.validator;
    this.validator.addSchema(label, configSchema);
    this.validator.ensure(label, config);
    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL;
    this.timeout = config.timeout;

    const { baseURL, timeout } = this;
    const headers = { Authorization: `Bearer ${this.apiKey}` };
    this.axios = axios.create({ baseURL, timeout, headers });
  }

  async searchBusinesses(lat, lon, options = {}) {
    const url = '/businesses/search';
    let results = {};
    const {
      locale,
      limit,
      offset,
      id,
      radius,
      term,
      categories,
    } = options;
    const logger = this.logger.child({
      id,
      lat,
      lon,
      limit,
      offset,
      term,
      radius,
      categories,
    });
    const getElapsedTime = startTimer();

    try {
      logger.debug('Retrieving businesses...');

      if (lat === undefined || lon === undefined) throw new BusinessesUnavailableError();
      const params = {
        limit,
        locale,
        latitude: lat,
        longitude: lon,
      };
      if (offset) params.offset = offset;
      if (term) params.term = term;
      if (radius) params.radius = radius;
      if (categories) params.categories = categories;

      const { data } = await this.axios.get(url, { params });
      const { businesses } = data;
      results = businesses;
      const responseTime = getElapsedTime();
      logger.debug('Retrieved businesses', { responseTime });
    } catch (error) {
      const responseTime = getElapsedTime();
      logger.error('Cannot retrieve businesses', { responseTime, error });
      results = error.errorCode ? error : new BusinessesUnavailableError();
    }
    return results;
  }
}

module.exports = { BusinessesService };

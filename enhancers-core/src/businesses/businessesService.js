const axios = require('axios');

const configSchema = require('./schemas/businessesServiceConfig.json');
const { DEFAULT_APIS } = require('../constants/constants');

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
      locale = DEFAULT_APIS.LOCALE,
      limit = DEFAULT_APIS.LIMIT_BUSINESSES,
      offset = 0,
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

    try {
      logger.debug('Retrieving businesses...');
      const params = { latitude: lat, longitude: lon, limit, locale };
      if (offset) params.offset = offset;
      if (term) params.term = term;
      if (radius) params.radius = radius;
      if (categories) params.categories = categories;

      const { data } = await this.axios.get(url, { params });
      const { businesses } = data;
      results = businesses;
      logger.debug('Retrieved businesses');
    } catch (error) {
      logger.error('Cannot retrieve businesses', { error });
      throw error;
    }
    return results;
  }
}

module.exports = { BusinessesService };

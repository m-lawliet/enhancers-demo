const rc = require('rc');

class Configurator {
  constructor({ appName, defaults = {} }) {
    this.config = defaults;
    rc(appName, this.config);
  }

  get(key) {
    return this.config[key];
  }

  getAll() {
    const { _, config, configs, ...rest } = this.config;
    return rest;
  }

  getConfigLocations() {
    const { configs: locations } = this.config;
    return locations;
  }
}

module.exports = { Configurator };

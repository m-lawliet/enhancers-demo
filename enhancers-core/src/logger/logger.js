const fs = require('fs-extra');
const { inspect } = require('util');
const { DateTime } = require('luxon');
const { createLogger, format, transports } = require('winston');

const loggerConfigSchema = require('./schemas/loggerConfig.json');

const filePathRegex = /^(\.?(\/?[^/*&%\s]+)+)\/([^/*&%\s]+\.[^*&%\s]+)$/;

class Logger {
  constructor(config, shared = {}) {
    this.validator = shared.validator;
    this.config = config;
    this.validator.addFormat('file-path', filePathRegex);
    this.validator.addSchema('logger', loggerConfigSchema);
    this.validator.ensure('logger', config);
    this.timestamp = null;
    this.commonFormat = null;
    this.transports = [];
    this.configureCommonFormat();
    this.configureFileTransport();
    this.configureConsoleTransport();
    return createLogger({
      transports: this.transports,
      format: this.commonFormat,
      exitOnError: false,
    });
  }

  configureCommonFormat() {
    const { config } = this;
    const { timezone: zone } = config;
    if (zone) this.timestamp = () => (DateTime.now().setZone(zone).toISO());
    else this.timestamp = () => DateTime.now().toISO();
    this.commonFormat = format.combine(
      format.timestamp({ format: this.timestamp }),
    );
  }

  configureFileTransport() {
    const { config, commonFormat } = this;
    const { fileTransport } = config;
    if (fileTransport && !fileTransport.disabled) {
      // NOTE: Using sync APIs is not a problem here, sync fs used only on logger startup
      fs.ensureFileSync(fileTransport.filename);
      const customFormat = format.combine(
        format.json(),
        commonFormat,
      );
      const transport = { ...fileTransport, format: customFormat };
      this.transports.push(new transports.File(transport));
    }
  }

  configureConsoleTransport() {
    const { config, commonFormat } = this;
    const { consoleTransport } = config;
    if (consoleTransport && !consoleTransport.disabled) {
      const customFormat = format.combine(
        format.align(),
        format.colorize({ all: true }),
        format.printf(({
          timestamp,
          level,
          label,
          id,
          message,
          ...meta
        }) => {
          const idString = id ? `{${id}}` : '';
          const metaString = Object
            .entries(meta)
            .filter(([, value]) => value !== undefined)
            .map(([key, value]) => `${key}=${inspect(value)}`).join('\n ');
          // TODO: Make constant file
          const padding = level.length <= 7 ? 7 : 17;
          const levelString = level.padEnd(padding, ' ');
          return `${timestamp} - ${levelString}: [${label}] ${idString} | ${message} \n ${metaString}`;
        }),
        commonFormat,
      );
      const transport = { ...consoleTransport, format: customFormat };
      this.transports.push(new transports.Console(transport));
    }
  }
}

module.exports = { Logger };

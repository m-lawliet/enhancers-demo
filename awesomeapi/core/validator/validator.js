const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const { inspect } = require('util');

const defaultOptions = {
  removeAdditional: true,
  useDefaults: true,
  coerceTypes: true,
};

/*
 * Simple wrapper around ajv that provides minor customizations and simplified API
 */
class Validator {
  constructor(options) {
    this.options = { ...defaultOptions, ...options };
    this.ajv = new Ajv(this.options);
    addFormats(this.ajv);
    // this.addFormat('city-list', city_list_regex);
  }

  addSchema(name, schema) {
    this.ajv.addSchema(schema, name);
  }

  addFormat(name, regex) {
    this.ajv.addFormat(name, regex);
  }

  test(name, obj) {
    let error;
    let valid = false;
    const validate = this.ajv.getSchema(name);

    try {
      valid = validate(obj);
      if (!valid) error = validate.errors;
    } catch (err) {
      error = err;
    }

    return {
      valid,
      error,
    };
  }

  ensure(name, obj) {
    const result = this.test(name, obj);
    if (!result.valid) throw new Error(`Test for ${name} failed, details=${inspect(result.error)}`);
    return true;
  }
}

module.exports = { Validator };

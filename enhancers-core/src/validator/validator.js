const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const { inspect } = require('util');

const defaultOptions = {
  removeAdditional: true,
  useDefaults: true,
  coerceTypes: true,
};

class Validator {
  constructor(options) {
    this.options = { ...defaultOptions, ...options };
    this.ajv = new Ajv(this.options);
    addFormats(this.ajv);
  }

  addSchema(name, schema) {
    this.ajv.addSchema(schema, name);
  }

  addFormat(name, regex) {
    this.ajv.addFormat(name, regex);
  }

  test(name, obj) {
    let error;
    let errorMessage;
    let valid = false;
    const validate = this.ajv.getSchema(name);

    try {
      valid = validate(obj);
      if (!valid) error = validate.errors;
    } catch (err) {
      error = err;
    }

    if (error) {
      errorMessage = `${error[0].instancePath} ${error[0].message}`
        .trim()
        .replace(new RegExp('"', 'g'), "'");
    }

    return {
      valid,
      error,
      errorMessage,
    };
  }

  ensure(name, obj) {
    const result = this.test(name, obj);
    if (!result.valid) throw new Error(`Test for ${name} failed, details=${inspect(result.error)}`);
    return true;
  }
}

module.exports = { Validator };

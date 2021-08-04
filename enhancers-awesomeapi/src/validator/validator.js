const { Validator: BaseValidator } = require('enhancers-core');

const unitsRegex = /standard|metric|imperial/;
const localeRegex = /^[a-z]{2}_[A-Z]{2}$/;
const cityListValidation = {
  type: 'string',
  // NOTE: check that passed cities are between 1 and 5 and with correct format
  validate: (value) => {
    let eachCityOk = false;
    const cities = value.split(';').filter((city) => city);
    const citiesLength = cities.length;
    const lengthOK = citiesLength >= 1 && citiesLength <= 5;
    if (cities.length) {
      eachCityOk = cities.every((city) => {
        const cityParts = city.split(',').filter((part) => part).length;
        return cityParts >= 1 && cityParts <= 3;
      });
    }
    return lengthOK && eachCityOk;
  },
};

class Validator {
  constructor() {
    this.validator = new BaseValidator();
    this.validator.addFormat('units', unitsRegex);
    this.validator.addFormat('locale', localeRegex);
    this.validator.addFormat('city-list', cityListValidation);
    return this.validator;
  }
}

module.exports = { Validator };

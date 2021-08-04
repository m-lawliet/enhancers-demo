const { tools: { localeToLang }, errors: { BadRequestError } } = require('enhancers-core');
const citiesQuerySchema = require('../../schemas/commons/citiesQuerySchema.json');

function validateQuery(validator) {
  const name = 'citiesQuery';
  validator.addSchema(name, citiesQuerySchema);

  return function validateQueryMiddleware(req, res, next) {
    const { query } = req;
    const { valid, errorMessage } = validator.test(name, query);
    if (!valid) throw new BadRequestError(errorMessage);
    next();
  };
}

function parseCities() {
  return function parseCitiesMiddleware(req, res, next) {
    const { name } = req.query;
    res.locals.cityList = name.split(';').filter((city) => city);
    next();
  };
}

function getGeolocation(geolocationService) {
  return async function getGeoMiddleware(req, res, next) {
    const { id, cityList } = res.locals;
    const { locale, units } = req.query;
    const lang = localeToLang(locale);
    const promises = cityList.map(
      (name) => geolocationService.getLocationByName(name, { id, lang, units }),
    );
    res.locals.geoList = await Promise.all(promises);
    next();
  };
}

// TODO: You should run in parallel getWeather and searchBusinesses
function getWeather(weatherService) {
  return async function getWeatherMiddleware(req, res, next) {
    const { id, geoList } = res.locals;
    const { locale, units } = req.query;
    const lang = localeToLang(locale);
    // TODO: Avoid crashing all if a single request fails
    const promises = geoList.map(
      ({ lat, lon }) => weatherService.getWeather(lat, lon, { id, lang, units }),
    );
    res.locals.weatherList = await Promise.all(promises);
    next();
  };
}

function searchBusinesses(businessesService) {
  return async function searchBusinessesMiddleware(req, res, next) {
    const { id, geoList } = res.locals;
    const {
      locale,
      businessLimit: limit,
      businessOffset: offset,
      businessRadius: radius,
      businessTerm: term,
      businessCategories: categories,
    } = req.query;
    // TODO: Avoid crashing all if a single request fails
    const options = { id, locale, limit, offset, radius, term, categories };
    const promises = geoList.map(
      ({ lat, lon }) => businessesService.searchBusinesses(lat, lon, options),
    );
    res.locals.businessesList = await Promise.all(promises);
    next();
  };
}

function prepareResponse() {
  return function prepareResponseMiddleware(req, res, next) {
    const { id, geoList, weatherList, businessesList, cityList } = res.locals;
    const cities = cityList.map((name, index) => {
      const geo = geoList[index];
      const weather = weatherList[index];
      const businesses = businessesList[index];
      return {
        name,
        geo,
        weather,
        businesses,
      };
    });
    res.locals.body = { id, cities };
    next();
  };
}

module.exports = {
  validateQuery,
  parseCities,
  getGeolocation,
  getWeather,
  searchBusinesses,
  prepareResponse,
};

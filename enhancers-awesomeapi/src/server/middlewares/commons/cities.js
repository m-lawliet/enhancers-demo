// TODO: Add validation function for cities and other params

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
    // TODO: Check if express throws correctly
    const promises = cityList.map((name) => geolocationService.getLocationByName(name, { id }));
    res.locals.geoList = await Promise.all(promises);
    next();
  };
}

// TODO: You should run in parallel getWeather and searchBusinesses
function getWeather(weatherService) {
  return async function getWeatherMiddleware(req, res, next) {
    const { id, geoList } = res.locals;
    // TODO: Check if express throws correctly
    // TODO: Avoid crashing all if a single request fails
    const promises = geoList.map(({ lat, lon }) => weatherService.getWeather(lat, lon, { id }));
    res.locals.weatherList = await Promise.all(promises);
    next();
  };
}

function searchBusinesses(businessesService) {
  return async function searchBusinessesMiddleware(req, res, next) {
    const { id, geoList } = res.locals;
    // TODO: Check if express throws correctly
    // TODO: Avoid crashing all if a single request fails
    const promises = geoList.map(
      ({ lat, lon }) => businessesService.searchBusinesses(lat, lon, { id }),
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
  parseCities,
  getGeolocation,
  getWeather,
  searchBusinesses,
  prepareResponse,
};

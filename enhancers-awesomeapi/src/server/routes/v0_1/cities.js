const { Router } = require('express');
const { middlewares } = require('enhancers-core');
const { cities } = require('../../middlewares/commons');

const { replies } = middlewares;

class CitiesRouter {
  constructor(shared = {}) {
    this.validator = shared.validator;
    this.geolocationService = shared.geolocationService;
    this.weatherService = shared.weatherService;
    this.businessesService = shared.businessesService;
    this.router = Router();
    this.prepareRoutes();
    return this.router;
  }

  prepareRoutes() {
    const {
      validator,
      geolocationService,
      weatherService,
      businessesService,
    } = this;

    const getCitiesMiddlewares = [
      cities.validateQuery(validator),
      cities.parseCities(),
      cities.getGeolocation(geolocationService),
      cities.getWeather(weatherService),
      cities.searchBusinesses(businessesService),
      cities.prepareResponse(),
      replies.ok(),
    ];
    this.router.get('/cities', ...getCitiesMiddlewares);
  }
}

module.exports = { CitiesRouter };

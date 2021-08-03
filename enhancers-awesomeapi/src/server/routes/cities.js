const { Router } = require('express');
const { middlewares } = require('enhancers-core');
const { cities } = require('../middlewares');

const { replies } = middlewares;

class CitiesRouter {
  constructor(shared = {}) {
    this.geolocationService = shared.geolocationService;
    this.weatherService = shared.weatherService;
    this.businessesService = shared.businessesService;
    this.router = Router();
    this.prepareRoutes();
    return this.router;
  }

  prepareRoutes() {
    const { geolocationService, weatherService, businessesService } = this;
    const getCitiesMiddlewares = [
      cities.parseCities(),
      cities.getGeolocation(geolocationService),
      cities.getWeather(weatherService),
      cities.searchBusinesses(businessesService),
      cities.prepareResponse(),
      // TODO: If previous async middlewares crashes, response is not sent. Fix this
      replies.ok(),
    ];
    this.router.get('/cities', ...getCitiesMiddlewares);
  }
}

module.exports = { CitiesRouter };

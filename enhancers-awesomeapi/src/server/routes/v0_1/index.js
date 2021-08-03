const { Router } = require('express');
const { CitiesRouter } = require('./cities');

class V01Router {
  constructor(shared) {
    this.shared = shared;
    this.router = Router();
    this.prepareRoutes();
    return this.router;
  }

  prepareRoutes() {
    const { shared } = this;
    // NOTE: Add other future routers to array
    const v01Routes = [CitiesRouter].map((Route) => new Route(shared));
    this.router.use('/0.1', v01Routes);
  }
}

module.exports = { V01Router };

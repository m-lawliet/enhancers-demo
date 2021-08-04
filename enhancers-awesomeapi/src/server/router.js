const { Router } = require('express');
const routes = require('./routes');

class AwesomeApiRouter {
  constructor(shared) {
    this.shared = shared;
    this.router = Router();
    this.prepareRoutes();
    return this.router;
  }

  prepareRoutes() {
    const { shared } = this;
    const apiMiddlewares = Object
      .values(routes)
      .map((Route) => new Route(shared));
    this.router.use('/awesomeapi', apiMiddlewares);
  }
}

module.exports = { AwesomeApiRouter };

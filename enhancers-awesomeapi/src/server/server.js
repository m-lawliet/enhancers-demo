const { Server: BaseServer } = require('enhancers-core');
const { CitiesRouter } = require('./routes');

class Server {
  constructor(config, shared) {
    const server = new BaseServer(config, shared);
    const citiesRouter = new CitiesRouter(shared);
    server.addUserMiddlewares(citiesRouter);
    return server;
  }
}

module.exports = { Server };

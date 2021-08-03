const { Server: BaseServer } = require('enhancers-core');
const { AwesomeApiRouter } = require('./router');
// const { CitiesRouter } = require('./routes/v0_1');

class Server {
  constructor(config, shared) {
    const server = new BaseServer(config, shared);
    const awesomeApiRouter = new AwesomeApiRouter(shared);
    server.addUserMiddlewares(awesomeApiRouter).then();
    // const citiesRouter = new CitiesRouter(shared);
    // server.addUserMiddlewares(citiesRouter).then();
    return server;
  }
}

module.exports = { Server };

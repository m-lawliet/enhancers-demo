const { Server: BaseServer } = require('enhancers-core');
const { AwesomeApiRouter } = require('./router');

class Server {
  constructor(config, shared) {
    const server = new BaseServer(config, shared);
    const awesomeApiRouter = new AwesomeApiRouter(shared);
    server.addUserMiddlewares(awesomeApiRouter).then();
    return server;
  }
}

module.exports = { Server };

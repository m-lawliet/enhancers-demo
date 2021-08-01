const commons = require('./commonMiddleware');
const factories = require('./factoryMiddleware');
const logs = require('./logMiddlewares');
const replies = require('./replyMiddlewares');

module.exports = {
  commons,
  factories,
  logs,
  replies,
};

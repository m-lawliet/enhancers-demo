# enhancers-demo

This toy project is a demo for **Enhancers**.

It's a simple implementation of an API Server collecting and integrating data from various services,
serving results to end users.

## Requirements

  - It should be implemented in node.js, express.js
  - It should expose an endpoint to users for retrieving data about up to 5 cities.
  - It should gather weather data for provided cities from [Open Weather Map APIs](https://openweathermap.org/api)
  - It should gather businesses data related to provided cities from [Yelp Fusion APIs](https://www.yelp.com/developers/documentation/v3/business_search)

## Usage

This project consists of two node modules, grouped for simplicity in a single repository.
Before running the application, you should first ensure to have installed node >= 12, then
install dependencies for both modules:

`cd enhancers-core && npm install && cd ../enhancers-awesomeapi && npm install`

Configuration will be handled internally from [rc module](https://www.npmjs.com/package/rc),
which allows using both _ENV vars_ and _configuration files_ even at the same time.
Options will be merged accordingly to documented priorities.

(Don't forget to also set `NODE_ENV=production` in production environments).

The recommended (but not mandatory) approach is to set insensitive data into a configuration file 
and set sensible data (such as api tokens) in environment variables.
For example, _geolocation.apiKey_ can be set as env variable using the following syntax:

`export awesomeapi_geolocation__apiKey=<my api key>`

omitting _geolocation.apiKey_ in configuration file.

Except for initial application name, each sub-property should be separated by double underscores. 
Further details on priorities and syntax is available on [rc module](https://www.npmjs.com/package/rc)
docs.

Free tier API keys for [Open Weather Map APIs](https://openweathermap.org/api) and
[Yelp Fusion APIs](https://www.yelp.com/developers/documentation/v3/business_search) are required
to run this application.

After having prepared ENV vars and/or configuration file, from "enhancers-awesomeapi" folder 
run application with:

`node src/app.js --config etc/config.json`

If no configuration file is needed, simply do not pass _--config_ argument.

A Postman collection and environment has been prepared in folder `enhancers-awesomeapi/docs/postman` 
for rapid testing.

### Configuration options

| Field                                        | Type    | Cardinality | Default   | Notes                                                                                     |
|----------------------------------------------|:-------:|------------:|----------:|-------------------------------------------------------------------------------------------|
| server                                       | object  | 1:1         |           | Contains configuration specific to server instance                                        |
| server → address                             | string  | 0:1         | 127.0.0.1 | Server listening address as IPv4, IPv6 or hostname                                        |
| server → address                             | number  | 0:1         | 3000      | Server listening port, between 1 and 65535                                                |
| geolocation                                  | object  | 1:1         |           | Contains configuration specific to `Open Weather geolocation APIs`                        |
| geolocation → baseUrl                        | string  | 1:1         |           | Base Url for `Open Weather geolocation APIs`                                              |
| geolocation → apiKey                         | string  | 1:1         |           | API key to be used for `Open Weather geolocation APIs`                                    |
| geolocation → timeout                        | number  | 0:1         | 10000     | API request timeout in `ms`, minimum 0                                                    |
| geolocation → retryTimes                     | number  | 0:1         | 3         | API request retries before giving up, minimum 1                                           |
| geolocation → maxCacheAge                    | number  | 0:1         | 600000    | API request cache ttl in `ms`                                                             |
| geolocation → maxCacheItems                  | number  | 0:1         | 10000     | API request cache max items                                                               |
| geolocation → thresholdThrottle              | number  | 0:1         | 1000      | API request threshold time in `ms` to wait before sending similar requests                |
| weather                                      | object  | 1:1         |           | Contains configuration specific to `Open Weather APIs`                                    |
| weather → baseUrl                            | string  | 1:1         |           | Base Url for `Open Weather APIs`                                                          |
| weather → apiKey                             | string  | 1:1         |           | API key to be used for `Open Weather APIs`                                    |
| weather → timeout                            | number  | 0:1         | 10000     | API request timeout in `ms`, minimum 0                                                    |
| weather → retryTimes                         | number  | 0:1         | 3         | API request retries before giving up, minimum 1                                           |
| weather → maxCacheAge                        | number  | 0:1         | 600000    | API request cache ttl in `ms`                                                             |
| weather → maxCacheItems                      | number  | 0:1         | 10000     | API request cache max items                                                               |
| weather → thresholdThrottle                  | number  | 0:1         | 1000      | API request threshold time in `ms` to wait before sending similar requests                |
| businesses                                   | object  | 1:1         |           | Contains configuration specific to `Open Weather APIs`                                    |
| businesses → baseUrl                         | string  | 1:1         |           | Base Url for `Yelp Fusion APIs`                                                           |
| businesses → apiKey                          | string  | 1:1         |           | API key to be used for `Yelp Fusion APIs`                                                 |
| businesses → timeout                         | number  | 0:1         | 10000     | API request timeout in `ms`, minimum 0                                                    |
| businesses → retryTimes                      | number  | 0:1         | 3         | API request retries before giving up, minimum 1                                           |
| businesses → maxCacheAge                     | number  | 0:1         | 600000    | API request cache ttl in `ms`                                                             |
| businesses → maxCacheItems                   | number  | 0:1         | 10000     | API request cache max items                                                               |
| businesses → thresholdThrottle               | number  | 0:1         | 1000      | API request threshold time in `ms` to wait before sending similar requests                |
| logger                                       | object  | 1:1         |           | Contains configuration specific to Logger module                                          |    
| logger → timezone                            | string  | 0:1         |           | Timezone to be used on timestamps (es `Europe/Rome`). UTC is used instead if not provided |    
| logger → fileTransport                       | object  | 1:1         |           | Contains configuration specific to logging on file                                        |    
| logger → fileTransport → disable             | boolean | 0:1         | false     | Disable logging on file                                                                   |    
| logger → fileTransport → level               | string  | 1:1         |           | Set log level (see [winston levels](https://github.com/winstonjs/winston#logging-levels)) |
| logger → fileTransport → handleExceptions    | boolean | 0:1         | true      | Enable catching and logging unhandled exception                                           |
| logger → fileTransport → handleRejections    | boolean | 0:1         | true      | Enable catching and logging unhandled rejections                                          |
| logger → fileTransport → filename            | string  | 1:1         |           | Path to file used for logging. If does not exists, it's automatically created             |
| logger → fileTransport → maxsize             | number  | 1:1         |           | Maximum single file size in `bytes`, minimum 1                                            |
| logger → fileTransport → maxFiles            | number  | 1:1         |           | Maximum number of log files to conserve before log rotating, minimum 1                    |
| logger → fileTransport → tailable            | boolean | 0:1         | true      | Enable tail on logs                                                                       |
| logger → fileTransport → timezone            | boolean | 0:1         | true      | Enable timezone usage in timestamps                                                       |
| logger → fileTransport → zippedArchive       | boolean | 0:1         | false     | Enable compression on rotated logs                                                        |
| logger → consoleTransport                    | object  | 1:1         |           | Contains configuration specific to logging on stdout and stderr                           |    
| logger → consoleTransport → disable          | boolean | 0:1         | false     | Disable logging console                                                                   |    
| logger → consoleTransport → level            | string  | 1:1         |           | Set log level (see [winston levels](https://github.com/winstonjs/winston#logging-levels)) |
| logger → consoleTransport → handleExceptions | boolean | 0:1         | true      | Enable catching and logging unhandled exception                                           |
| logger → consoleTransport → handleRejections | boolean | 0:1         | true      | Enable catching and logging unhandled rejections                                          |


Configuration example:


```json
{
  "server": {
    "address": "localhost",
    "port": 3000
  },
  "geolocation": {
    "baseURL": "http://api.openweathermap.org/geo/1.0/",
    "apiKey": "<Open Weather API key>",
    "timeout": 10000,
    "retryTimes": 3,
    "maxCacheAge": 600000,
    "maxCacheItems": 10000,
    "thresholdThrottle": 1000
  },
  "weather": {
    "baseURL": "https://api.openweathermap.org/data/2.5/",
    "apiKey": "<Open Weather API key>",
    "timeout": 10000,
    "retryTimes": 3,
    "maxCacheAge": 600000,
    "maxCacheItems": 10000,
    "thresholdThrottle": 1000
  },
  "businesses": {
    "baseURL": "https://api.yelp.com/v3",
    "apiKey": "<Yelp Fusion API key>",
    "timeout": 10000,
    "retryTimes": 3,
    "maxCacheAge": 600000,
    "maxCacheItems": 10000,
    "thresholdThrottle": 1000
  },
  "logger": {
    "timezone": "Europe/Rome",
    "fileTransport": {
      "disable": false,
      "level": "info",
      "filename": "./logs/server.log",
      "maxFiles": 5,
      "maxsize": 5242880,
      "zippedArchive": true
    },
    "consoleTransport": {
      "disable": false,
      "level": "debug"
    }
  }
}

```

## Rationale and Other Notes

### Code structure
By conscious choice, this project does not follow classic trivial structure of most Express applications and
is somewhat unconventional.

The code has been structured to favor code re-usage wherever possible, so most modules and services have been 
implemented separately from main application. 

For this reason, some widely used modules/libraries have been wrapped into customized 
or simplified core modules instead of being used directly, and in general, composition over 
inheritance has been preferred.
This choice can introduce some initial developing time overhead but has the following benefits:

  - it's easier to reuse common functionalities into different applications 
  - better consistency in behaviour between similar applications
  - better overall stability, changes to common functionalities should not be ported to multiple code bases.
  - increased testability, it's not strictly required to using advanced mocking features (such as jest module mock)
  - swapping an external library does not require full code review/refactor

The drawbacks are the following, but can be limited as described shortly after:

  - more limited or clunky interfaces
  - less customization

Having a simplified interface can seem like a limitation, but can be easily overcome by replacing the implementation
where needed. 
This project adopts the dependency injection paradigma, so if a module is too limited for some specific need
it's straightforward to replace it with something better (as long as it has a compatible interface).

Dependency instances should be created on the root level of the application and passed to other components with a 
top-down approach. In some cases, a methodology for extending or overriding default behaviour has been directly 
implemented to allow some customization without providing a whole new dependency.

This code base has been divided into two parts, that can be considered as separate Node.js modules:

  - `enhancers-core`: contains reusable components
  - `enhancers-awesomeapi`: application implementation


### API versions supported

This application support multiple APIs version exposed by a single service, but only `version 0.1` has been
implemented so far.


### Why using Express 5 in alpha release

For better async middleware handling, Express 5 (alpha) has been chosen instead of stable versions 4.x.
This can be a hazard in production environments but this Demo is not mission critical, so a cleaner code
has been preferred at risk of unexpected bugs due to unstable release.
See motivation in [Error Handling](https://expressjs.com/en/guide/error-handling.html)
and [Express 5 migration notes](https://expressjs.com/en/guide/migrating-5.html).


### Caching requests

External APIs calls are cached for improved performance and efficiency.
For now, caching works only locally as in memory cache for each instance application,
but to support greater stability in production, caching using external "centralized" services
should be considered instead.


### Use under reverse proxy

This application should be executed under reverse proxy, so no solutions have been applied regarding standard 
production policies such as incoming request rate limits, HTTPS/TLS support or data compression. 
These features should be implemented at proxy level.


### Use under process manager

If deployed as standalone application into VM environments or containers, a task runner such as 
[pm2](https://pm2.keymetrics.io/) is recommended both for stability and performance scaling.
Using a task runner will not be necessary on serverless deploys.


## Features not implemented

The following features have been planned but eventually will not be implemented or completed due 
to reaching deadline (they can be implemented in future if required):

  - authentication
  - unit tests
  - functional tests
  - usage docs for modules (especially on core modules)
  - graceful server shutdown
  - helper for application config/options
  - metrics collection service (in [Prometheus](https://prometheus.io/) format)
  - optimized version for serverless environments


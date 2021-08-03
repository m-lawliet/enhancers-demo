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

TODO
TODO: Don't forget to set NODE_ENV to “production”

## Rationale and Other Notes

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

- more limited or clunky interfaces, less customization

Having a simplified interface can seem like a limitation, but can be easily overcome by replacing the implementation
where needed. 
This project adopts the dependency injection paradigma, so if a module is too limited for some specific need
it's straightforward to replace it with something better (as long as it has a compatible interface).
Instances should be created on the root level of the application and passed to other components with a top-down 
approach.
In some cases, a methodology for extending or overriding default behaviour has been directly implemented to
allow some customization without providing a whole new dependency.

This code base has been divided into two parts, that can be considered as separate Node.js modules:

- `enhancers-core`: contains reusable components
- `enhancers-awesomeapi`: application implementation


### Why using Express 5 in alpha release

For better async middleware handling, Express 5 (alpha) has been chosen instead of stable versions 4.x.
This can be a hazard in production environments but this Demo is not mission critical, so a cleaner code
has been preferred at risk of unexpected bugs due to unstable release.
See motivation in [Error Handling](https://expressjs.com/en/guide/error-handling.html)
and [Express 5 migration notes](https://expressjs.com/en/guide/migrating-5.html).

### Use under reverse proxy

This application should be executed under reverse proxy, so no solutions have been applied regarding standard 
production policies such as incoming request rate limits, HTTPS/TLS support or data compression. 
These features should be implemented at proxy level.


### Use under process manager

If deployed as standalone application into VM environments or containers, a task runner such as 
[pm2](https://pm2.keymetrics.io/) is recommended both for stability and performance scaling.
Using a task runner will not be necessary on serverless deploys.

## Features not implemented

The following has been planned but eventually will not be implemented or completed due to reaching 
deadline (they can be implemented in future if required):

- unit tests
- functional tests
- metrics collection service (in [Prometheus](https://prometheus.io/) format)


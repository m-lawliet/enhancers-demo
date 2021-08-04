API v.0.1 Endpoints
===================

.. list-table:: Summary REST API
  :header-rows: 1
  :widths: 45, 10, 40

  * - **URL**
    - **Method**
    - **Description**
  * - /awesomeapi/0.1/cities
    - GET
    - :ref:`ref_get_cities_info`



.. _ref_get_cities_info:

Retrieve information for a list of cities
-----------------------------------------

This endpoint returns geolocation, weather and businesses information
for a list of up to 5 cities.


Request url
~~~~~~~~~~~

https://host/awesomeapi/0.1/cities?name=<**city_list**>


Request headers
~~~~~~~~~~~~~~~

No request headers required.


Request body (JSON)
~~~~~~~~~~~~~~~~~~~

No request body required.


Request query string
~~~~~~~~~~~~~~~~~~~~

For simplicity, only a sub-set of params supported by external APIs
has been implemented.

The following table describes supported query params:


.. list-table:: Query string params
   :header-rows: 1
   :widths: 15, 12, 15, 13, 53

   * - **Param**
     - **Type**
     - **Cardinality**
     - **Default**
     - **Notes**
   * - name
     - String
     - 1:5
     -
     - City list separated by semicolons.
       Only first matching entry will be returned.
       When a given city name has more than one match,
       city name can be expressed more precisely using comma
       as separator for the fields:
       `<name>,<state code>,<country state>` or
       `<name>,<country state>`
       For example, Rome in US can be expressed as "Rome,NY,US",
       and Rome in Italy as "Rome,IT".
   * - locale
     - String
     - 0:1
     - it_IT
     - Localization string. Will be passed as is to Yelp APIs
       and stripped to first token (before "_") before being
       passed to Open Weather APIs.
   * - units
     - String
     - 0:1
     - metric
     - Measurement unit system used on Weather results.
       Allowed values are: "standard", "metric", "imperial".
   * - businessLimit
     - Number >=1
     - 0:1
     - 10
     - Number of businesses to return for each given city
   * - businessOffset
     - Number >=0
     - 0:1
     - 0
     - Number of businesses to offset before returning matching entries
       for each given city. Useful for pagination
   * - businessRadius
     - Number >=1
     - 0:1
     -
     - Radius (in meters) used for businesses research
   * - businessTerm
     - String
     - 0:1
     -
     - Term used for businesses research
   * - businessCategory
     - String
     - 0:1
     -
     - Category used for businesses research


Response body (JSON)
~~~~~~~~~~~~~~~~~~~~

.. list-table:: Response body fields
   :header-rows: 1
   :widths: 20, 10, 15, 13, 50

   * - **Field**
     - **Type**
     - **Cardinality**
     - **Default**
     - **Notes**
   * - id
     - string
     - 1:1
     -
     - Unique request ID. Useful for cross referencing logs in case of errors or
       other analytics.
   * - cities
     - array of objects
     - 1:1
     -
     - List of cities results. Its elements will be referred as `city` on following lines.
   * - city → name
     - string
     - 1:1
     -
     - City name as originally provided.
   * - city → geo
     - object
     - 1:1
     -
     - Contains geolocation data for provided city.
   * - city → weather
     - object
     - 1:1
     -
     - Contains weather data for provided city, trying to use requested language
       localization if originally sent. For simplicity, it has the same form as
       response given by Open Weather Map APIs. For further details, see
       `documentation <https://openweathermap.org/api/one-call-api>`_
   * - city → businesses
     - object
     - 1:1
     -
     - Contains businesses information for provided city, trying to use requested language
       localization if originally sent. For simplicity, it has the same form as
       response given by Yelp Fusion APIs. For further details, see
       `documentation <https://www.yelp.com/developers/documentation/v3/business_search>`_
   * - city → geo → name
     - string
     - 1:1
     -
     - City name using requested language localization if any, or default localization
       instead.
   * - city → geo → country
     - string
     - 1:1
     -
     - Country code for required city
   * - city → geo → state
     - string
     - 0:1
     -
     - State code for required city, if it has any
   * - city → geo → lat
     - string
     - 1:1
     -
     - Latitude for requested city
   * - city → geo → lon
     - string
     - 1:1
     -
     - Longitude for requested city


Example
~~~~~~~

Request
"""""""

The client performs the following request:

GET https://host/awesomeapi/0.1/cities?name=New%20York;Rome,NY,US;Roma,IT


Success Response
""""""""""""""""

In case of success, service will respond with HTTP status `200 - OK`
and the following response JSON body:


.. code-block:: json

    {
      "id": "4a068740-f48d-11eb-9880-cff104f23360",
      "cities": [
        {
          "name": "New York",
          "geo": {
            "name": "New York",
            "country": "US",
            "state": "NY",
            "lat": 40.7143,
            "lon": -74.006
          },
          "weather": { ... },
          "businesses": { ... }
        },
        {
          "name": "Rome,NY,US",
          "geo": {
            "name": "Rome",
            "country": "US",
            "state": "NY",
            "lat": 43.2128,
            "lon": -75.4557
          },
          "weather": { ... },
          "businesses": { ... }
        },
        {
          "name": "Roma,IT",
          "geo": {
            "name": "Rome",
            "country": "IT",
            "lat": 41.8947,
            "lon": 12.4839
          },
          "weather": { ... },
          "businesses": { ... }
        }
      ]
    }


Error Response
""""""""""""""

See section :ref:`_ref_api_error_handling`

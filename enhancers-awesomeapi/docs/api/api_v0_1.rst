API v.0.1 Endpoints
===================

.. list-table:: Summary REST API
  :header-rows: 1
  :widths: 45, 10, 40

  * - **URL**
    - **Method**
    - **Description**
  * - /awesomeapi/0.1/cities?name=<**city_list**>
    - GET
    - :ref:`ref_get_cities_info`



.. _ref_get_cities_info:

Retrieve information for a list of cities
-----------------------------------------

This endpoint returns weather and businesses information for a list
of up to 5 cities.


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
     - City list separated by semicolons


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
   * - cities
     - array of objects
     - 1:1
     -
     - List of cities results. Its elements will be referred as `city` on following lines.
   * - city → name
     - string
     - 1:1
     -
     - Originally provided city name.
   * - city → geo
     - object
     - 1:1
     -
     - Contains geolocation data for provided city.
   * - city → weather
     - object
     - 1:1
     -
     - Contains weather data for provided city.
   * - city → businesses
     - object
     - 1:1
     -
     - Contains businesses information for provided city.


**TODO**: Define geo, weather and business sub-structures based on information collected
from external APIs


Example
~~~~~~~

Request
"""""""

The client performs the following request:

GET https://host/awesomeapi/0.1/cities?name=New%20York;London;Paris;Rome;Madrid


Success Response
""""""""""""""""

In case of success, service will respond with HTTP status `200 - OK`
and the following response JSON body:

.. code-block:: json

    {
      "cities": [
        {
          "name": "New York",
          "geo": {},
          "weather": {},
          "businesses": {}
        },
        {
          "name": "London",
          "geo": {},
          "weather": {},
          "businesses": {}
        },
        {
          "name": "Paris",
          "geo": {},
          "weather": {},
          "businesses": {}
        },
        {
          "name": "Rome",
          "geo": {},
          "weather": {},
          "businesses": {}
        },
        {
          "name": "Madrid",
          "geo": {},
          "weather": {},
          "businesses": {}
        }
      ]
    }


Error Response
""""""""""""""

See section :ref:`_ref_api_error_handling`

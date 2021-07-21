API v.0.1 Endpoints
===================

.. cssclass:: longtable

.. list-table:: Summary REST API
  :header-rows: 1
  :widths: 45, 10, 40

  * - **URL**
    - **Method**
    - **Description**
  * - /awesomeapi/0.1/cities?<**city_list**>
    - GET
    - :ref:`ref_get_cities_info`



.. _ref_get_cities_info:

Retrieve information for a list of cities
-----------------------------------------

This endpoint returns weather and businesses information for a list
of up to 5 cities.


Request url
~~~~~~~~~~~

https://host/awesomeapi/0.1/cities?<**city_list**>


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
   * - cities
     - String
     - 1:5
     -
     - City list separated by commas


Response body (JSON)
~~~~~~~~~~~~~~~~~~~~

.. list-table:: Response body fields
   :header-rows: 1
   :widths: 15, 12, 15, 13, 53

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


.. todo:: Define geo, weather and business sub-structures based on information collected
          from external APIs
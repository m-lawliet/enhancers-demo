.. _ref_api_error_handling:

API Error Handling
==================

Every API endpoint follows the following conventions when error occurs.
Responses will have generic *HTTP status* :

  - `400 (Bad Request)`: The request cannot be elaborated because of syntactic
    or semantic errors occurred. User has performed an invalid request.

  - `401 (Unauthorized)`: User has provided wrong credentials or has not provided
    credentials at all.

  - `403 (Forbidden)`: Caller address is in blacklist.

  - `404 (Not Found)`: Required path is not a supported API endpoint

  - `500 (Internal Server Error)`: This request cannot be elaborated because of
    errors in application or external services from which application depends.


Each response will also return a JSON body, composed of fields `errorCode`
and `errorDescription`, providing a unique error ID and a human friendly
error message respectively.

JSON body response example:

.. code-block:: json

  {
    "errorCode": "40002",
    "errorDescription": "Bad Request. Reason: BAD JSON"
  }


Error codes
-----------

.. cssclass:: longtable

.. list-table::
  :header-rows: 1
  :widths: 15, 30, 40

  * - **Error Code**
    - **Error Description**
    - **Notes**
  * - 30001
    - DEFAULT
    - Generic Error.
  * - 40001
    - UNSUPPORTED VERSION
    - Requested API version is invalid or not currently supported.
  * - 40002
    - BAD JSON
    - Malformed JSON body.
  * - 40003
    - INVALID PARAMS
    - Missing or invalid request params, ex missing required headers,
      JSON body fields, URL params, query strings, etc.
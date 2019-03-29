# NodeJS mentoring. Homework application

#Task 7

Run solution:
npm run task7

### Get JWT token
POST http://localhost:8080/api/auth
Content-Type: application/json
{ "login" : "admin", "password": "admin" }


### Then save it to config.json property JWT_TOKEN, and run
GET http://localhost:8080/api/cities
GET http://localhost:8080/api/cities/random
GET http://localhost:8080/api/cities/**ID** 

POST http://localhost:8080/api/cities
Content-Type: application/json
{"city":"Деражня, Ukraine","ll":"33,539182499999999"}

PUT http://localhost:8080/api/cities/5c9be98d3f73192020f05111
Content-Type: application/json
{"city":"Хмельницкий, Ukraine","ll":"33.3686498,4.539182499999999"}

DELETE http://localhost:8080/api/cities/**ID**
Content-Type: application/json

GET http://localhost:8080/api/users
GET http://localhost:8080/api/users/**ID**
DELETE http://localhost:8080/api/users/**ID**

GET http://localhost:8080/api/products
POST http://localhost:8080/api/products
{"id":6,"name":"pink dress","price":550}

GET http://localhost:8080/api/products/**ID**
DELETE http://localhost:8080/api/products/**ID**
GET http://localhost:8080/api/products/**ID**/name


### Decoded info from JWT token should be displayed in console

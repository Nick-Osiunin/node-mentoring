# NodeJS mentoring. Homework application

#Task 7

Run solution:
npm run task7

### Get JWT token
POST http://localhost:8080/auth
Content-Type: application/json
{ "login" : "admin", "password": "admin" }


### Then save it to constant variable JWT_TOKEN, and run
GET http://localhost:8080/products
GET http://localhost:8080/users

### Decoded info from JWT token should be displayed in console

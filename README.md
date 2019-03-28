# NodeJS mentoring. Homework application

#Task 7

Run solution:
npm run task7

### Get JWT token
POST http://localhost:8080/api/auth
Content-Type: application/json
{ "login" : "admin", "password": "admin" }


### Then save it to config.json property JWT_TOKEN, and run
GET http://localhost:8080/api/products
GET http://localhost:8080/api/users

### Decoded info from JWT token should be displayed in console

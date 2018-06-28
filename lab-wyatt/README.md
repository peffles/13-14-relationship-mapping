### Lab 13: Single Resource
- by Wyatt Pefley
# Overview
- The objective of  this lab is to build a RESTful HTTP server using express and MongoDB with a model of our choosing.

## Getting Started

1. Fork GitHub repository
2. Clone repository to your local machine
3. Install all required dependencies with the `npm  i` command.
4. Run `npm run test` command and watch for green

##Architecture
- This project is built using 
- Javascript ES6
- NodeJS
- MongoDB
- Babel
- Superagent
- Eslint
- Winston
- Testing by Jest

# Server.js
- Before starting the server you must launch MongoDB by entering `npm run dbon` into your console.
 
### Endpoints
* POST `/api/street`
  * If the route is successful, the server will respond with a 200 status code and the created resource
  * If the server fails due to a bad request, it will return a 400 status code
* GET `/api/streer/:id`
  * If the resource is found the server will return the resource and a 200 status code.  
  * if during a GET request the specific id in not found the server will return a 404 status code.
* PUT `/api/street/:id`
  * the PUT route will return the updated resource and a 200 status code 
  * if the specific id is not found the the server will respond with a 404 error code.
  * Any other invalid requests throw a 404.
* DELETE `/api/street/:id`
  * if the provided id exists and the route successfully deletes the resource it will return a 204 status code.
  * if the provided id does not exist then the server will respond with a 404 error code.

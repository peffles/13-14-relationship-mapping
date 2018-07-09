# Lab 14 - Mongo Double resource
**Author**: Wyatt Pefley
**Version**: 1.0.0

## Overview
This lab project was a continuation of lab 13, adding a second mongoose model to create a one-to-many relationship in our database. Express is used to handle http requests and MongoDB as a persistence layer. My model that that would be a street that would have many store relationships.
## Store Routes
POST /api/stores

Data is passed as stringifed JSON in a POST request to create a new store. If successful, a 200 status code is sent. On failure, a 400 status code is sent. The name must be unique, if the name is already in the database, a 409 status code is sent.

```GET /api/stores/:id```

A GET request with an id responds with a 200 status code if it is successful in finding it, and a 404 status code if not.

```PUT /api/stores```

Data is passed as stringifed JSON in a PUT request to update a store. If successful, a 200 status code is sent. On failure, a 400 status code is sent. The name must be unique, so if the name is already in the database, a 409 status code is sent, indicating a duplicate key.

```DELETE /api/stores/:id```

Deletes a store from the database

## Street Routes

#### POST Request
Posts a street to the database.

#### GET Request
To retrieve a specific street.

#### DELETE Request
Delete a street from the database by making a DELETE request to the api/streets/:id enpoint. A 204 status is sent if it has been deleted. If the id does not exist in the database, a 404 status code is sent.

#### PUT Request
Updates a street in the database.

## Getting Started
1. Fork GitHub repo
2. Clone repo to your local machine
3. Install dependencies using ```npm i``` 
4. To start the database and test the routes,enter: ```npm run dbon```
5. ```npm run test``` to run tests.

## Architecture
* JavaScript
* Node 
* Express 
* MongoDB 
* Mongoose 
* superagent
* winston 
* logger 
* jest 
* babel
* dotenv
* body-parser
* faker

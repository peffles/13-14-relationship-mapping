'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpError from 'http-errors';
import logger from '../lib/logger';
import Store from '../model/store-model';

const jsonParser = bodyParser.json();
const storeRouter = new Router();

storeRouter.post('/api/stores', jsonParser, (request, response, next) => {
  if (!request.body.name) {
    logger.log(logger.ERROR, 'STORE_ROUTER | POST - Responding with 400 code');
    return next(new HttpError(400, 'store name is required'));
  }

  return new Store(request.body).save()
    .then((store) => {
      logger.log(logger.INFO, 'STORE ROUTER | POST - responding with a 200 status code');
      response.json(store);
    })
    .catch(next);
});

storeRouter.put('/api/stores/:id', jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };

  return Store.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedStore) => {
      if (!updatedStore) {
        return next(new HttpError(404, 'STORE ROUTER | PUT - store to update not found'));
      }
      logger.log(logger.INFO, 'STORE ROUTER | PUT - responding with a 200 status code');
      return response.json(updatedStore);
    })
    .catch(next);
});

storeRouter.get('/api/stores/:id', (request, response, next) => {
  return Store.findById(request.params.id)
    .then((store) => {
      if (!store) {
        return next(new HttpError(404, 'GET | store not found'));
      }
      logger.log(logger.INFO, 'STORE ROUTER | GET - responding with a 200 status code');
      return response.json(store);
    })
    .catch(next);
});

storeRouter.delete('/api/stores/:id', (request, response, next) => {
  return Store.findByIdAndRemove(request.params.id)
    .then((store) => {
      if (!store) {
        return next(new HttpError(404, 'STORE ROUTER | DELETE - store not found'));
      }
      logger.log(logger.INFO, 'STORE ROUTER | DELETE - responding with a 204 status code');
      return response.sendStatus(204);
    });
});


export default storeRouter;

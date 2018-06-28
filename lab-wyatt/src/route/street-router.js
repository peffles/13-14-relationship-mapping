'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import Street from '../model/street-model';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();

const streetRouter = new Router();

streetRouter.post('/api/streets', jsonParser, (request, response, next) => {
  if (!request.body.name) {
    logger.log(logger.ERROR, 'STREET_ROUTER | Responding with 400 code');
    return next(new HttpErrors(400, 'Street name is required'));
  }

  return new Street(request.body).save()
    .then((street) => {
      logger.log(logger.INFO, 'STREET ROUTER | POST - responding with a 200 status code');
      return response.json(street);
    })
    .catch(next);
});

streetRouter.put('/api/streets/:id', jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };
  return Street.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedStreet) => {
      if (!updatedStreet) {
        logger.log(logger.ERROR, 'STREET ROUTER | PUT - responding with 404 status code');
        return next(new HttpErrors(404, 'street not found'));
      }
      logger.log(logger.INFO, 'STREET ROUTER | PUT - responding with 200 status code');
      return response.json(updatedStreet);
    })
    .catch(next);
});

streetRouter.get('/api/streets/:id', (request, response, next) => {
  return Street.findById(request.params.id)
    .then((street) => {
      if (!street) {
        logger.log(logger.INFO, 'STREET ROUTER | GET - responding with a 404 status code');
        return next(new HttpErrors(404));
      }
      logger.log(logger.INFO, 'STREET ROUTER | GET - responding with a 200 status code');
      return response.json(street);
    })
    .catch(next);
});

streetRouter.delete('/api/streets/:id', (request, response, next) => {
  return Street.findByIdAndRemove(request.params.id)
    .then((street) => {
      if (!street) {
        logger.log(logger.INFO, 'STREET ROUTER | DELETE - responding with a 404 status code');
        return next(new HttpErrors(404));
      }
      logger.log(logger.INFO, 'STREET ROUTER | DELETE - responding with a 204 status code');
      return response.sendStatus(204);
    })
    .catch(next);
});

export default streetRouter;

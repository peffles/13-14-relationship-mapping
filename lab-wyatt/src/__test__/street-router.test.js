'use strict';

import faker from 'faker';
import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateStreetMock, pRemoveStreetMock } from './lib/street-mock';

const API_URL = `http://localhost:${process.env.PORT}/api/streets`;

describe('api/v1/streets', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveStreetMock);

  describe('POST api/streets', () => {
    test('respond with 200 status for a successful POST', () => {
      const mockStreet = {
        name: faker.lorem.words(1),
        streetLength: faker.random.number(),
      };
      return superagent.post(API_URL)
        .send(mockStreet)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();
          expect(response.body.name).toEqual(mockStreet.name);
          expect(response.body.streetLength).toEqual(mockStreet.streetLength);
        });
    });
    test('409 due to duplicate name', () => {
      return pCreateStreetMock()
        .then((street) => {
          const mockStreet = {
            name: street.name,
            streetLength: street.streetLength,
          };
          return superagent.post(API_URL)
            .send(mockStreet);
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(409);
        });
    });
    test('400 due to lack of name', () => {
      return superagent.post(API_URL)
        .send({})
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });
    test('400 due to bad json', () => {
      return superagent.post(API_URL)
        .send('{')
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });
  });

  describe('PUT api/streets', () => {
    test('respond with 200 status from a successful PUT', () => {
      let streetToUpdate = null;
      return pCreateStreetMock()
        .then((street) => {
          streetToUpdate = street;
          return superagent.put(`${API_URL}/${street._id}`)
            .send({ streetLength: 10000 });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.name).toEqual(streetToUpdate.name);
          expect(response.body.streetLength).toEqual(10000);
          expect(response.body._id).toEqual(streetToUpdate._id.toString());
        });
    });
    test('409 due to duplicate name', () => {
      let firstMock = null;
      return pCreateStreetMock()
        .then((street) => {
          firstMock = street;
          return pCreateStreetMock();
        })
        .then((secondStreet) => {
          return superagent.put(`${API_URL}/${secondStreet._id}`)
            .send({ name: firstMock.name });
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(409);
        });
    });
    test('should respond with 404 if the id is not found', () => {
      return superagent.put(`${API_URL}/thiswontwork`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
    test('400 due to lack of data sent to update', () => {
      return superagent.post(API_URL)
        .send({})
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });
  });

  describe('GET /api/streets', () => {
    test('should respond with 200 if there are no errors', () => {
      let streetToTest = null;
      return pCreateStreetMock()
        .then((street) => {
          streetToTest = street;
          return superagent.get(`${API_URL}/${street.id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.name).toEqual(streetToTest.name);
          expect(response.body.location).toEqual(streetToTest.location);
          expect(response.body.brands).toEqual(streetToTest.brands);
        });
    });
    test('should respond with 404 if no street is found', () => {
      return superagent.get(`${API_URL}/thiswontwork`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('DELETE /api/streets', () => {
    test('should delete a street and return a 204 status code', () => {
      return pCreateStreetMock()
        .then((street) => {
          return superagent.delete(`${API_URL}/${street.id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
        });
    });
    test('should respond with 404 if there is no street to be deleted', () => {
      return superagent.get(`${API_URL}/thiswontwork`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
});

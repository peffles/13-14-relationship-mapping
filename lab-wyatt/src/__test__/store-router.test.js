'use strict';

import faker from 'faker';
import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateStreetMock } from './lib/street-mock';
import { pCreateStoreMock, pRemoveStoreMock } from './lib/store-mock';

const API_URL = `http://localhost:${process.env.PORT}/api/stores`;

describe('/api/stores', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveStoreMock);

  describe('POST /api/stores', () => {
    test('should give 200 status code for successful post', () => {
      return pCreateStreetMock()
        .then((streetMock) => {
          const storeToPost = {
            name: faker.lorem.words(2),
            brands: faker.lorem.words(2),
            type: faker.lorem.words(3),
            street: streetMock._id,
          };
          return superagent.post(API_URL)
            .send(storeToPost)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body.name).toEqual(storeToPost.name);
              expect(response.body.brands).toEqual(storeToPost.brands);
              expect(response.body.type).toEqual(storeToPost.type);
              expect(response.body.street).toEqual(storeToPost.street.toString());
            });
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
    test('409 due to duplicate name', () => {
      return pCreateStoreMock()
        .then((mock) => {
          const mockStore = {
            name: mock.store.name,
            brands: mock.store.brands,
            street: mock.store.street,
          };
          return superagent.post(API_URL)
            .send({ name: mockStore.name, brands: mockStore.brands, street: mockStore.street });
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(409);
        });
    });
  });

  describe('PUT api/stores/:id', () => {
    test('should return a 200 status code for successful update', () => {
      let storeToUpdate = null;
      return pCreateStoreMock()
        .then((mockStore) => {
          storeToUpdate = mockStore;
          return superagent.put(`${API_URL}/${mockStore.store._id}`)
            .send({ name: 'Target' });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.name).toEqual('Target');
          expect(response.body.brands).toEqual(storeToUpdate.store.brands);
        });
    });
    test('should respond with 404 if the id is invalid', () => {
      return superagent.get(`${API_URL}/thiswontwork`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
    test('should respond with status 400 due to lack of required properties', () => {
      return superagent.post(API_URL)
        .send({})
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });
    test('409 due to duplicate name', () => {
      let mockStore = null;
      return pCreateStoreMock()
        .then((mock) => {
          mockStore = {
            name: mock.store.name,
            brands: mock.store.brands,
            street: mock.store.street,
          };
          return pCreateStoreMock();
        })
        .then((mock2) => {
          return superagent.put(`${API_URL}/${mock2.store._id}`)
            .send({ 
              name: mockStore.name, 
              brands: mockStore.brands, 
              street: mockStore.street, 
            });
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(409);
        });
    });
  });

  describe('GET api/stores/:id', () => {
    test('should return a 200 status code for a successful get request', () => {
      let storeToUpdate = null;
      return pCreateStoreMock()
        .then((mockStore) => {
          storeToUpdate = mockStore;
          return superagent.get(`${API_URL}/${mockStore.store._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.name).toEqual(storeToUpdate.store.name);
          expect(response.body.brands).toEqual(storeToUpdate.store.brands);
          expect(response.body.type).toEqual(storeToUpdate.store.type);
        });
    });
    test('should respond with 404 if no store is found', () => {
      return superagent.get(`${API_URL}/thiswontwork`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('DELETE /api/stores/:id', () => {
    test('should delete a street and return a 204 status code', () => {
      return pCreateStoreMock()
        .then((mock) => {
          return superagent.delete(`${API_URL}/${mock.store._id}`);
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

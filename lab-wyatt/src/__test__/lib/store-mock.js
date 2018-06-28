'use strict';

import faker from 'faker';
import Store from '../../model/store-model';
import * as streetMock from './street-mock';

const pCreateStoreMock = () => {
  const resultsMock = {};
  
  return streetMock.pCreateStreetMock()
    .then((createdStreet) => {
      resultsMock.street = createdStreet;

      return new Store({
        name: faker.lorem.words(1),
        brands: faker.lorem.words(3),
        type: faker.lorem.words(1),
        street: createdStreet._id,
      }).save();
    })
    .then((newStore) => {
      resultsMock.store = newStore;
      return resultsMock;
    });
};

const pRemoveStoreMock = () => Promise.all([
  Store.remove({}),
  streetMock.pRemoveStreetMock(),
]);

export { pCreateStoreMock, pRemoveStoreMock };

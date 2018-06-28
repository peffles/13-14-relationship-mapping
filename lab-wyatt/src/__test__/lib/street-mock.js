'use strict';

import faker from 'faker';
import Street from '../../model/street-model';

const pCreateStreetMock = () => {
  return new Street({
    name: faker.lorem.words(1),
    streetLength: faker.random.number(),
  }).save();
};

const pRemoveStreetMock = () => Street.remove({});

export { pCreateStreetMock, pRemoveStreetMock };

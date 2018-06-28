'use strict';

import mongoose from 'mongoose';
import HttpError from 'http-errors';
import Street from './street-model';

const storeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  brands: {
    type: String,
    required: true,
  },
  type: {
    type: String,
  },
  createdOn: {
    type: Date,
    default: () => new Date(),
  },
  street: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'street',
  },
});

function storePreHook(done) {
  return Street.findById(this.street)
    .then((streetFound) => {
      if (!streetFound) {
        throw new HttpError(404, 'street not found');
      }
      streetFound.stores.push(this._id);
      return streetFound.save();
    })
    .then(() => done())
    .catch(done); 
}

const storePostHook = (document, done) => {
  return Street.findById(document.street)
    .then((streetFound) => {
      if (!streetFound) {
        throw new HttpError(500, 'street not found');
      }
      streetFound.stores = streetFound.stores.filter((store) => {
        return store._id.toString() !== document._id.toString();
      });
    })
    .then(() => done())
    .catch(done);
};

storeSchema.pre('save', storePreHook);
storeSchema.post('remove', storePostHook);

export default mongoose.model('store', storeSchema);

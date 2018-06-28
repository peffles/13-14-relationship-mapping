'use strict';

import mongoose from 'mongoose';

const streetSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  streetLength: {
    type: Number,
    required: false,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },

  stores: [
    {
      type: mongoose.Schema.Types.ObjectId, ref: 'store',
    },
  ],
}, {

  usePushEach: true,
});

export default mongoose.model('street', streetSchema);

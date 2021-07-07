const mongoose = require('mongoose');

const batchesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    code: {
      type: String,
      trim: true,
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'manufacture',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('batches', batchesSchema);

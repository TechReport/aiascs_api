const mongoose = require('mongoose');

const reportSchema = mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    attachment: {
      type: Object,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

reportSchema.pre('deleteOne', (next) => {
  console.log('delete report');
  next();
});

module.exports = mongoose.model('reports', reportSchema);

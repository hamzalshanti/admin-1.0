const mongoose = require('mongoose');
const productTranslationSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
  },
});
const ProductTranslation = mongoose.model(
  'producttranslation',
  productTranslationSchema
);
module.exports = ProductTranslation;

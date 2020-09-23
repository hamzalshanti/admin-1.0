const mongoose = require('mongoose');
const categoryTranslationSchema = mongoose.Schema({
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
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
  },
});
const CategoryTranslation = mongoose.model(
  'categorytranslation',
  categoryTranslationSchema
);
module.exports = CategoryTranslation;

const mongoose = require('mongoose');
const tagTranslationSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  tag: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});
const TagTranslation = mongoose.model('tagtranslation', tagTranslationSchema);
module.exports = TagTranslation;

const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 1,
  },
  qty: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
  },
  mainImage: {
    type: String,
  },
  gallary: {
    type: [],
  },
  rateCount: {
    type: Number,
    default: 0,
  },
  rateValue: {
    type: Number,
    default: 0,
  },
  rateAverage: {
    type: Number,
    default: 0,
  },
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'tag',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// productSchema.pre('validate', function (next) {
//   if (this.productName) {
//     this.slug = slugify(this.productName, {
//       lower: true,
//       strict: true,
//     });
//   }
//   next();
// });

const Product = mongoose.model('product', productSchema);
module.exports = Product;

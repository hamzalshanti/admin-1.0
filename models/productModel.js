const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 1,
  },
  productQty: {
    type: Number,
    required: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
  },
  mainImage: {
    type: String,
  },
  productGallary: {
    type: [],
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

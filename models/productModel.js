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
        ref: 'category'
    },
    productImage: {
        type: String,
    },
    productTags: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});
const Product = mongoose.model('product', productSchema);
module.exports = Product;
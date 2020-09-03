const mongoose = require('mongoose');
const categorySchema = mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
    },
    categoryDescription: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Category = mongoose.model('category', categorySchema);
module.exports = Category;
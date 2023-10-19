const mongoose = require('mongoose')

const lineItemSchema = new mongoose.Schema({
    productId: {
        type: String,
    },
    variantId: {
        type: String,
    },
    quantity: {
        type: Number,
    },
    _id: false
})

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    lineItems: [lineItemSchema],
    total: {
        type: Number,
    }
})


module.exports = mongoose.model('Cart', cartSchema)
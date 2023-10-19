const mongoose = require('mongoose')

const lineItemSchema = new mongoose.Schema({
    productId: {
        type: String,
    },
    title: {
        type: String,
    },
    variantId: {
        type: Number,
    },
    variantName: {
        type: String,
    },
    quantity: {
        type: Number,
    },
    image: {
        type: String,
    },
    price: {
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
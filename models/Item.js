const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    country: {
        type: String,
        default: 'Indonesia'
    },
    city: {
        type: String,
        required: true
    },
    is_popular: {
        type: Boolean
    },
    description: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        default: 'malam'
    },
    sum_booking: {
        type: Number,
        default: 0
    },
    category_id: {
        type: ObjectId,
        ref: 'Category'
    },
    image_id: [{
        type: ObjectId,
        ref: 'Image'
    }],
    feature_id: [{
        type: ObjectId,
        ref: 'Feature'
    }],
    activity_id: [{
        type: ObjectId,
        ref: 'Activity'
    }]
})

module.exports = mongoose.model('Item', itemSchema)
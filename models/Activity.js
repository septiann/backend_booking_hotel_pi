const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema

const activitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    image_url: {
        type: String,
        required: true
    },
    is_popular: {
        type: Boolean
    },
    item_id: {
        type: ObjectId,
        ref: 'Item'
    }
})

module.exports = mongoose.model('Activity', activitySchema)
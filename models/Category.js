const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    item_id: [{
        type: ObjectId,
        ref: 'Item'
    }]
})

module.exports = mongoose.model('Category', categorySchema)
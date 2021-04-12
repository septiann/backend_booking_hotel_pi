const mongoose = require("mongoose")

const imageSchema = new mongoose.Schema({
    image_url: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Image', imageSchema)
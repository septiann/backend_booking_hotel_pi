const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema

const bookingSchema = new mongoose.Schema({
    bookingStartDate: {
        type: Date,
        required: true
    },
    bookingEndDate: {
        type: Date,
        required: true
    },
    invoice: {
        type: String,
        required: true
    },
    item_id: {
        _id: {
            type: ObjectId,
            ref: 'Item',
            required: true
        },
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        duration: {
            type: Number,
            required: true
        }
    },
    total: {
        type: Number,
        required: true
    },
    member_id: {
        type: ObjectId,
        ref: 'Member'
    },
    bank_id: {
        type: ObjectId,
        ref: 'Bank'
    },
    payments: {
        proofPayment: {
            type: String,
            required: true
        },
        bankFrom: {
            type: String,
            required: true
        },
        accountHolder: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        }
    }
})

module.exports = mongoose.model('Booking', bookingSchema)
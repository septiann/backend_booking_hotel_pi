const Item = require('../models/Item')
const Activity = require('../models/Activity')
const Booking = require('../models/Booking')
const Category = require('../models/Category')
const Bank = require('../models/Bank')
const Member = require('../models/Member')

module.exports = {
    landingPage: async (req, res) => {
        try {
            const mostPicked = await Item.find().select('_id title country city price unit image_id').limit(5).populate({
                path: 'image_id',
                select: '_id image_url'
            })
            const traveller = await Booking.find()
            const treasure = await Activity.find()
            const city = await Item.find()
            const category = await Category.find().select('_id name').limit(3).populate({
                path: 'item_id',
                select: '_id title image_id country city is_popular',
                perDocumentLimit: 4,
                option: {
                    sort: {
                        sum_booking: -1
                    }
                },
                populate: {
                    path: 'image_id',
                    select: '_id image_url',
                    perDocumentLimit: 1
                }
            })
            const testimonial = {
                _id: "asd1293uasdads1",
                image_url: "images/testimonial-landingpage.jpg",
                name: "Best Staycation Ever",
                rate: 4.55,
                content: "Pengalaman liburan yang sangat hebat bersama teman, dan mungkin saya akan coba lagi lain waktu..",
                family_name: "Raisa Adriana",
                family_occupation: "Aktris"
            }

            for(let i = 0; i < category.length; i++) {
                for(let x = 0; x < category[i].item_id.length; x++) {
                    const item = await Item.findOne({ _id: category[i].item_id[x]._id })
                    
                    item.is_popular = false
                    await item.save()

                    if(category[i].item_id[0] === category[i].item_id[x]) {
                        item.is_popular = true
                        await item.save()
                    }
                }
            }

            res.status(200).json({
                hero: {
                    travellers: traveller.length,
                    treasures: treasure.length,
                    cities: city.length
                },
                mostPicked,
                category,
                testimonial
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Internal server error." })
        }
        
    },

    detailPage: async (req, res) => {
        try {
            const { id } = req.params
            const item = await Item.findOne({
                _id: id
            }).populate({
                path: 'feature_id',
                select: '_id name qty image_url'
            }).populate({
                path: 'activity_id',
                select: '_id name type image_url'
            }).populate({
                path: 'image_id',
                select: '_id image_url'
            })
            const bank = await Bank.find()
            const testimonial = {
                _id: "asd1293uasdads1",
                image_url: "images/testimonial-detailpage.jpg",
                name: "Keluarga Bahagia",
                rate: 4.55,
                content: "Perjalanan hiburan yang sangat hebat dengan keluarga, dan mungkin saya akan coba lagi lain waktu..",
                family_name: "Septian Nugraha",
                family_occupation: "Back-End Developer"
            }

            res.status(200).json({
                ...item._doc,
                bank,
                testimonial
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Internal server error." })
        }
    },

    bookingPage: async (req, res) => {
        const { id_item, duration, /** price, */ bookingStartDate, bookingEndDate, firstName, lastName, email, phoneNumber, accountHolder, bankFrom } = req.body

        if(!req.file) {
            return res.status(404).json({ message: "Image not found" })
        }

        if(id_item === undefined || duration === undefined || /** price === undefined || */ bookingStartDate === undefined || bookingEndDate === undefined || firstName === undefined || lastName === undefined || email === undefined || phoneNumber === undefined || accountHolder === undefined || bankFrom === undefined) {
            res.status(404).json({ message: "Please completed all fields." })
        }

        const item = await Item.findOne({ _id: id_item })

        if(!item) {
            return res.status(404).json({ message: "Item ID not found." })
        }

        item.sum_booking += 1

        await item.save()

        let total = item.price * duration
        let tax = total * 0.10

        const invoice = Math.floor(1000000 * Math.random() * 9000000)

        const member = await Member.create({
            firstName,
            lastName,
            email,
            phoneNumber
        })

        const newBooking = {
            invoice,
            bookingStartDate,
            bookingEndDate,
            total: total += tax,
            item_id: {
                _id: item.id,
                title: item.title,
                price: item.price,
                duration: duration
            },
            member_id: member.id,
            payments: {
                proofPayment: `images/${req.file.filename}`,
                bankFrom: bankFrom,
                accountHolder: accountHolder
            }
        }

        const booking = await Booking.create(newBooking)

        res.status(201).json({ message: "Booking success.", booking })
    }
}
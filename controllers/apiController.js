const Item = require('../models/Item')
const Activity = require('../models/Activity')
const Booking = require('../models/Booking')
const Category = require('../models/Category')

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
                name: "Keluarga Bahagia",
                rate: 4.55,
                content: "Perjalanan hiburan yang sangat hebat dengan keluarga, dan mungkin saya akan coba lagi lain waktu..",
                family_name: "Septian Nugraha",
                family_occupation: "Back-End Developer"
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
            res.status(500).json({ message: "internal server error" })
        }
        
    }
}
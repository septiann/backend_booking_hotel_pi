const Category = require('../models/Category')
const Bank = require('../models/Bank')
const Item = require('../models/Item')
const Image = require('../models/Image')
const Feature = require('../models/Feature')
const Activity = require('../models/Activity')
const User = require('../models/User')
const Booking = require('../models/Booking')
const Member = require('../models/Member')

const fs = require('fs-extra')
const path = require('path')
const bcrypt = require('bcryptjs')

module.exports = {
    // Login dan Logout
    viewLogin: async (req, res) => {
        try {
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = { message: alertMessage, status: alertStatus }

            if(req.session.user === null || req.session.user === undefined) {
                res.render('index', {
                    alert,
                    title: 'InnCation | Login'
                })
            } else {
                res.redirect('/admin/dashboard')
            }

        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
        }

        res.redirect('/admin/login')
    },
    actionLogin: async (req, res) => {
        try {
            const { username, password } = req.body
            
            const user = await User.findOne({ username: username })
            if(!user) {
                req.flash('alertMessage', `Akun pengguna tidak ditemukan.`)
                req.flash('alertStatus', 'danger')
                
                res.redirect('/admin/login')
            }
            
            const isPasswordMatch = await bcrypt.compare(password, user.password)
            if(!isPasswordMatch) {
                req.flash('alertMessage', `Password yang Anda masukan salah.`)
                req.flash('alertStatus', 'danger')

                res.redirect('/admin/login')
            }

            req.session.user = {
                id: user.id,
                username: user.username
            }

            res.redirect('/admin/dashboard')
        } catch (error) {
            res.redirect('/admin/login')
        }
    },
    actionLogout: (req, res) => {
        req.session.destroy()
        res.redirect('/admin/login')
    },

    // Dashboard
    viewDashboard: async (req, res) => {
        try {
            const member = await Member.find()
            const booking = await Booking.find()
            const item = await Item.find()

            res.render('admin/dashboard/view_dashboard', {
                title: 'InnCation | Dashboard',
                user: req.session.user,
                member,
                booking,
                item
            })
            
        } catch (error) {
            res.redirect('/admin/dashboard')
        }
    },

    // Category
    viewCategory: async (req, res) => {
        try {
            const category = await Category.find()
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = { message: alertMessage, status: alertStatus }

            res.render('admin/category/view_category', {
                category,
                alert,
                title: 'InnCation | Category',
                user: req.session.user
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
        }

        res.redirect('/admin/category')
    },
    addCategory: async (req, res) => {
        try {
            const { name } = req.body
            
            await Category.create({ name })

            req.flash('alertMessage', 'Berhasil menambah kategori.')
            req.flash('alertStatus', 'success')
        } catch (error) {
            req.flash('alertMessage', `Gagal menambah kategori. ${error.message}`)
            req.flash('alertStatus', 'danger')
        }
        
        res.redirect('/admin/category')
    },
    editCategory: async (req, res) => {
        try {
            const { id, name } = req.body
            const category = await Category.findOne({ _id: id })
            
            category.name = name
            await category.save()
            
            req.flash('alertMessage', 'Berhasil mengubah kategori.')
            req.flash('alertStatus', 'success')
        } catch (error) {
            req.flash('alertMessage', `Gagal mengubah kategori. ${error.message}`)
            req.flash('alertStatus', 'danger')
        }

        res.redirect('/admin/category')
    },
    deleteCategory: async (req, res) => {
        try {
            const { id } = req.params
            const category = await Category.findOne({ _id: id })
            await category.remove()
            
            req.flash('alertMessage', 'Berhasil menghapus kategori.')
            req.flash('alertStatus', 'success')
        } catch (error) {
            req.flash('alertMessage', `Gagal menghapus kategori. ${error.message}`)
            req.flash('alertStatus', 'danger')
        }

        res.redirect('/admin/category')
    },

    // Bank
    viewBank: async (req, res) => {
        try {
            const bank = await Bank.find()

            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = { message: alertMessage, status: alertStatus }

            res.render('admin/bank/view_bank', {
                title: 'InnCation | Bank',
                alert,
                bank,
                user: req.session.user
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
        }

        res.redirect('/admin/bank')
    },
    addBank: async (req, res) => {
        try {
            const { bank_name, account_number, account_name } = req.body
            
            await Bank.create({
                bank_name,
                account_number,
                account_name,
                image_url: `images/${req.file.filename}`
            })

            req.flash('alertMessage', 'Berhasil menambah data bank.')
            req.flash('alertStatus', 'success')
        } catch (error) {
            req.flash('alertMessage', `Gagal menambah data bank. ${error.message}`)
            req.flash('alertStatus', 'danger')
        }

        res.redirect('/admin/bank')
    },
    editBank: async (req, res) => {
        try {
            const { id, bank_name, account_number, account_name } = req.body
            const bank = await Bank.findOne({ _id: id })

            bank.bank_name = bank_name
            bank.account_number = account_number
            bank.account_name = account_name

            if(req.file !== undefined) {
                await fs.unlink(path.join(`public/${bank.image_url}`))
                bank.image_url = `images/${req.file.filename}`
            }

            await bank.save()

            req.flash('alertMessage', 'Berhasil mengubah data bank.')
            req.flash('alertStatus', 'success')
        } catch (error) {
            req.flash('alertMessage', `Gagal mengubah data bank. ${error.message}`)
            req.flash('alertStatus', 'danger')
        }

        res.redirect('/admin/bank')
    },
    deleteBank: async (req, res) => {
        try {
            const { id } = req.params
            const bank = await Bank.findOne({ _id: id })
            await fs.unlink(path.join(`public/${bank.image_url}`))
            await bank.remove()

            req.flash('alertMessage', 'Berhasil menghapus data bank.')
            req.flash('alertStatus', 'success')
        } catch (error) {
            req.flash('alertMessage', `Gagal menghapus data bank. ${error.message}`)
            req.flash('alertStatus', 'danger')
        }

        res.redirect('/admin/bank')
    },

    // Item
    viewItem: async (req, res) => {
        try {
            const item = await Item.find().populate({ path: 'image_id', select: 'id image_url' }).populate({ path: 'category_id', select: 'id name' })
            const category = await Category.find()
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = { message: alertMessage, status: alertStatus }

            res.render('admin/item/view_item', {
                title: 'InnCation | Item',
                category,
                alert,
                item,
                action: 'view',
                user: req.session.user
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
        }

        res.redirect('/admin/item')
    },
    addItem: async (req, res) => {
        try {
            const { category_id, title, price, city, description } = req.body

            if(req.files.length > 0) {
                const category = await Category.findOne({ _id: category_id })
                const new_item = {
                    category_id: category._id,
                    title,
                    price,
                    city,
                    description
                }
                const item = await Item.create(new_item)
                category.item_id.push({ _id: item._id })
                await category.save()
                for(let i = 0; i < req.files.length; i++) {
                    const image_save = await Image.create({ image_url: `images/${req.files[i].filename}`})
                    item.image_id.push({ _id: image_save._id })
                    await item.save()
                }
                req.flash('alertMessage', 'Berhasil menambah item.')
                req.flash('alertStatus', 'success')
            }
        } catch (error) {
            req.flash('alertMessage', `Gagal menambah item. ${error.message}`)
            req.flash('alertStatus', 'danger')
        }

        res.redirect('/admin/item')
    },
    showImageItem: async (req, res) => {
        try {
            const { id } = req.params
            const item = await Item.findOne({ _id: id }).populate({ path: 'image_id', select: 'id image_url'})
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = { message: alertMessage, status: alertStatus }
            
            res.render('admin/item/view_item', {
                title: "InnCation | Show Image Item",
                alert,
                item,
                action: 'show image',
                user: req.session.user
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
        }

        res.redirect('/admin/item')
    },
    showEditItem: async (req, res) => {
        try {
            const { id } = req.params
            const item = await Item.findOne({ _id: id }).populate({ path: 'image_id', select: 'id image_url'}).populate({ path: 'category_id', select: 'id name' })
            const category = await Category.find()
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = { message: alertMessage, status: alertStatus }
            
            res.render('admin/item/view_item', {
                title: "InnCation | Edit Item",
                alert,
                item,
                category,
                action: 'edit',
                user: req.session.user
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
        }

        res.redirect('/admin/item')
    },
    editItem: async (req, res) => {
        try {
            const { id } = req.params
            const { category_id, title, price, city, description } = req.body
            const item = await Item.findOne({ _id: id }).populate({ path: 'image_id', select: 'id image_url'}).populate({ path: 'category_id', select: 'id name' })

            if(req.files.length > 0) {
                for(let i = 0; i < item.image_id.length; i++) {
                    const image_update = await Image.findOne({ _id: item.image_id[i]._id })
                    await fs.unlink(path.join(`public/${image_update.image_url}`))
                    image_update.image_url = `images/${req.files[i].filename}`
                    await image_update.save()
                }

            }

            item.title = title
            item.price = price
            item.city = city
            item.description = description
            item.category_id = category_id
            await item.save()

            req.flash('alertMessage', 'Berhasil mengubah item.')
            req.flash('alertStatus', 'success')
        } catch (error) {
            req.flash('alertMessage', `Gagal mengubah item. ${error.message}`)
            req.flash('alertStatus', 'danger')
        }

        res.redirect('/admin/item')
    },
    deleteItem: async (req, res) => {
        try {
            const { id } = req.params
            const item = await Item.findOne({ _id: id }).populate('image_id')

            for(let i = 0; i < item.image_id.length; i++) {
                Image.findOne({ _id: item.image_id[i]._id }).then((image) => {
                    fs.unlink(path.join(`public/${image.image_url}`))
                    image.remove()
                }).catch((error) => {
                    req.flash('alertMessage', `Gagal menghapus item. ${error.message}`)
                    req.flash('alertStatus', 'danger')
                })
            }
            await item.remove()

            req.flash('alertMessage', 'Berhasil menghapus item.')
            req.flash('alertStatus', 'success')
        } catch (error) {
            req.flash('alertMessage', `Gagal menghapus item. ${error.message}`)
            req.flash('alertStatus', 'danger')
        }

        res.redirect('/admin/item')
    },
    viewDetailItem: async (req, res) => {
        const { item_id } = req.params
        try {
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = { message: alertMessage, status: alertStatus }

            const feature = await Feature.find({ item_id: item_id })
            const activity = await Activity.find({ item_id: item_id })

            res.render('admin/item/detail_item/view_detail_item', {
                title: 'InnCation | Detail Item',
                alert,
                item_id,
                feature,
                activity,
                user: req.session.user
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
        }

        res.redirect(`/admin/item/show-detail-item/${item_id}`)
    },
    addFeature: async (req, res) => {
        const { feature_name, qty, item_id } = req.body
        try {
            if(!req.file) {
                req.flash('alertMessage', `Gambar tidak ditemukan. ${error.message}`)
                req.flash('alertStatus', 'danger')
            }

            const feature = await Feature.create({
                name: feature_name,
                qty,
                item_id,
                image_url: `images/${req.file.filename}`
            })

            const item = await Item.findOne({ _id: item_id })

            item.feature_id.push({ _id: feature._id })
            await item.save()

            req.flash('alertMessage', 'Berhasil menambah fitur.')
            req.flash('alertStatus', 'success')
        } catch (error) {
            req.flash('alertMessage', `Gagal menambah fitur. ${error.message}`)
            req.flash('alertStatus', 'danger')
        }

        res.redirect(`/admin/item/show-detail-item/${item_id}`)
    },
    editFeature: async (req, res) => {
        const { id, feature_name, qty, item_id } = req.body
        try {
            const feature = await Feature.findOne({ _id: id })

            feature.name = feature_name
            feature.qty = qty

            if(req.file !== undefined) {
                await fs.unlink(path.join(`public/${feature.image_url}`))
                feature.image_url = `images/${req.file.filename}`
            }

            await feature.save()

            req.flash('alertMessage', 'Berhasil mengubah data fitur.')
            req.flash('alertStatus', 'success')
        } catch (error) {
            req.flash('alertMessage', `Gagal mengubah data fitur. ${error.message}`)
            req.flash('alertStatus', 'danger')
        }

        res.redirect(`/admin/item/show-detail-item/${item_id}`)
    },
    deleteFeature: async (req, res) => {
        const { id, item_id } = req.params

        try {
            const feature = await Feature.findOne({ _id: id })
            const item = await (await Item.findOne({ _id: item_id })).populate('feature_id')

            for(let i = 0; i < item.feature_id.length; i++) {
                if(item.feature_id[i]._id.toString() === feature._id.toString()) {
                    item.feature_id.pull({ _id: feature._id })
                    await item.save()
                }
            }
            
            await fs.unlink(path.join(`public/${feature.image_url}`))
            await feature.remove()

            req.flash('alertMessage', 'Berhasil menghapus data fitur.')
            req.flash('alertStatus', 'success')
        } catch (error) {
            req.flash('alertMessage', `Gagal menghapus data fitur. ${error.message}`)
            req.flash('alertStatus', 'danger')
        }

        res.redirect(`/admin/item/show-detail-item/${item_id}`)
    },
    addActivity: async (req, res) => {
        const { activity_name, type, item_id } = req.body
        try {
            if(!req.file) {
                req.flash('alertMessage', `Gambar tidak ditemukan. ${error.message}`)
                req.flash('alertStatus', 'danger')
            }

            const activity = await Activity.create({
                name: activity_name,
                type,
                item_id,
                image_url: `images/${req.file.filename}`
            })

            const item = await Item.findOne({ _id: item_id })

            item.activity_id.push({ _id: activity._id })
            await item.save()

            req.flash('alertMessage', 'Berhasil menambah aktifitas.')
            req.flash('alertStatus', 'success')
        } catch (error) {
            req.flash('alertMessage', `Gagal menambah aktifitas. ${error.message}`)
            req.flash('alertStatus', 'danger')
        }

        res.redirect(`/admin/item/show-detail-item/${item_id}`)
    },
    editActivity: async (req, res) => {
        const { id, activity_name, type, item_id } = req.body
        try {
            const activity = await Activity.findOne({ _id: id })

            activity.name = activity_name
            activity.type = type

            if(req.file !== undefined) {
                await fs.unlink(path.join(`public/${activity.image_url}`))
                activity.image_url = `images/${req.file.filename}`
            }

            await activity.save()

            req.flash('alertMessage', 'Berhasil mengubah data aktifitas.')
            req.flash('alertStatus', 'success')
        } catch (error) {
            req.flash('alertMessage', `Gagal mengubah data aktifitas. ${error.message}`)
            req.flash('alertStatus', 'danger')
        }

        res.redirect(`/admin/item/show-detail-item/${item_id}`)
    },
    deleteActivity: async (req, res) => {
        const { id, item_id } = req.params

        try {
            const activity = await Activity.findOne({ _id: id })
            const item = await (await Item.findOne({ _id: item_id })).populate('activity_id')

            for(let i = 0; i < item.activity_id.length; i++) {
                if(item.activity_id[i]._id.toString() === activity._id.toString()) {
                    item.activity_id.pull({ _id: activity._id })
                    await item.save()
                }
            }
            
            await fs.unlink(path.join(`public/${activity.image_url}`))
            await activity.remove()

            req.flash('alertMessage', 'Berhasil menghapus data aktifitas.')
            req.flash('alertStatus', 'success')
        } catch (error) {
            req.flash('alertMessage', `Gagal menghapus data aktifitas. ${error.message}`)
            req.flash('alertStatus', 'danger')
        }

        res.redirect(`/admin/item/show-detail-item/${item_id}`)
    },

    // Booking
    viewBooking: async (req, res) => {
        try {
            const booking = await Booking.find().populate('member_id').populate('bank_id')
            
            res.render('admin/booking/view_booking', {
                title: 'InnCation | Booking Order',
                user: req.session.user,
                booking
            })
        } catch (error) {
            res.redirect('/admin/booking')
        }
    },
    showDetailBooking: async (req, res) => {
        const { id } = req.params
        try {
            const alertMessage = req.flash('alertMessage')
            const alertStatus = req.flash('alertStatus')
            const alert = { message: alertMessage, status: alertStatus }

            const booking = await Booking.findOne({ _id: id }).populate('member_id').populate('bank_id')

            res.render('admin/booking/show_detail_booking', {
                title: 'InnCation | Detail Booking Order',
                user: req.session.user,
                booking,
                alert
            })
        } catch (error) {
            res.redirect('/admin/booking')
        }
    },
    actionConfirmation: async (req, res) => {
        const { id } = req.params
        try {
            const booking = await Booking.findOne({ _id: id })
            booking.payments.status = 'Disetujui'
            await booking.save()

            req.flash('alertMessage', 'Berhasil setujui pembayaran.')
            req.flash('alertStatus', 'success')

            res.redirect(`/admin/booking/${id}`)
        } catch (error) {
            res.redirect(`/admin/booking/${id}`)
        }
    },
    actionReject: async (req, res) => {
        const { id } = req.params
        try {
            const booking = await Booking.findOne({ _id: id })
            booking.payments.status = 'Ditolak'
            await booking.save()

            req.flash('alertMessage', 'Berhasil menolak pembayaran.')
            req.flash('alertStatus', 'success')

            res.redirect(`/admin/booking/${id}`)
        } catch (error) {
            res.redirect(`/admin/booking/${id}`)
        }
    }
}
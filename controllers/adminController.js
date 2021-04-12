const Category = require('../models/Category')
const Bank = require('../models/Bank')
const Item = require('../models/Item')
const Image = require('../models/Image')

const fs = require('fs-extra')
const path = require('path')

module.exports = {
    // Dashboard
    viewDashboard: (req, res) => {
        res.render('admin/dashboard/view_dashboard', {
            title: 'InnCation | Dashboard'
        })
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
                title: 'InnCation | Category'
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
                bank
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
                action: 'view'
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
                action: 'show image'
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
                action: 'edit'
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

    // Booking
    viewBooking: (req, res) => {
        res.render('admin/booking/view_booking', {
            title: 'InnCation | Booking Order'
        })
    }
}
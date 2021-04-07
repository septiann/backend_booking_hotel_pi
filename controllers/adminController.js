const Category = require('../models/Category')
const Bank = require('../models/Bank')

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
    viewItem: (req, res) => {
        res.render('admin/item/view_item', {
            title: 'InnCation | Item'
        })
    },

    // Booking
    viewBooking: (req, res) => {
        res.render('admin/booking/view_booking', {
            title: 'InnCation | Booking Order'
        })
    }
}
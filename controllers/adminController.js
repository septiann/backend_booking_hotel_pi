const Category = require('../models/Category')

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
            
        }

        res.redirect('/admin/category')
    },
    addCategory: async (req, res) => {
        try {
            const { name } = req.body
            
            await Category.create({ name })

            req.flash('alertMessage', 'Sukses menambah kategori.')
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
            
            req.flash('alertMessage', 'Sukses mengubah kategori.')
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
            
            req.flash('alertMessage', 'Sukses menghapus kategori.')
            req.flash('alertStatus', 'success')
        } catch (error) {
            req.flash('alertMessage', `Gagal menghapus kategori. ${error.message}`)
            req.flash('alertStatus', 'danger')
        }

        res.redirect('/admin/category')
    },

    // Bank
    viewBank: (req, res) => {
        res.render('admin/bank/view_bank', {
            title: 'InnCation | Bank'
        })
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
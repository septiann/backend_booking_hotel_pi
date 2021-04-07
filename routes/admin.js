const router = require('express').Router()
const adminController = require('../controllers/adminController')
const { upload } = require('../middlewares/multer')

// Dashboard Endpoint
router.get('/dashboard', adminController.viewDashboard)

// Category Endpoint
router.get('/category', adminController.viewCategory)
router.post('/category', adminController.addCategory)
router.put('/category', adminController.editCategory)
router.delete('/category/:id', adminController.deleteCategory)

// Bank Endpoint
router.get('/bank', adminController.viewBank)
router.post('/bank', upload, adminController.addBank)
router.put('/bank', upload, adminController.editBank)
router.delete('/bank/:id', adminController.deleteBank)

// Item
router.get('/item', adminController.viewItem)

// Booking
router.get('/booking', adminController.viewBooking)

module.exports = router
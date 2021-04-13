const router = require('express').Router()
const adminController = require('../controllers/adminController')
const { upload, uploadMultiple } = require('../middlewares/multer')
const auth = require('../middlewares/auth')

// Login Endpoint
router.get('/login', adminController.viewLogin)
router.post('/login', adminController.actionLogin)
router.use(auth)
router.get('/logout', adminController.actionLogout)

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

// Item Endpoint
router.get('/item', adminController.viewItem)
router.post('/item', uploadMultiple, adminController.addItem)
router.get('/item/show-image/:id', adminController.showImageItem)
router.get('/item/:id', adminController.showEditItem)
router.put('/item/:id', uploadMultiple, adminController.editItem)
router.delete('/item/:id/delete', adminController.deleteItem)

router.get('/item/show-detail-item/:item_id', adminController.viewDetailItem)
router.post('/item/add/feature', upload, adminController.addFeature)
router.put('/item/update/feature', upload, adminController.editFeature)
router.delete('/item/:item_id/feature/:id', adminController.deleteFeature)

router.post('/item/add/activity', upload, adminController.addActivity)
router.put('/item/update/activity', upload, adminController.editActivity)
router.delete('/item/:item_id/activity/:id', adminController.deleteActivity)

// Booking
router.get('/booking', adminController.viewBooking)

module.exports = router
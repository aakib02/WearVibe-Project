const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");


// create  vendors
router.post('/createVendor',  authMiddleware, roleMiddleware('customer'), vendorController.createVendorController)

// Get vendors
// router.get('/vendors',authMiddleware, roleMiddleware('admin'), vendorController.getVendors);

// Update vendor status
router.patch('/updateVendorStatus/:vendorId',authMiddleware, roleMiddleware('admin'), vendorController.updateVendorStatus);

// change user role  to vendor
router.patch('/changeRole/:userId',authMiddleware, roleMiddleware('admin'),  vendorController.changeRole);
// router.get('/pendingVendors', authMiddleware, roleMiddleware('admin'), vendorController.getPendingVendors);
// router.patch('/updateVendorStatus/:vendorId', authMiddleware, roleMiddleware('admin'), vendorController.updateVendorStatus);


router.get('/getBrand',authMiddleware,vendorController.getBrandController)
router.get('/getVendor',authMiddleware , vendorController.getVendorsController)

module.exports = router;

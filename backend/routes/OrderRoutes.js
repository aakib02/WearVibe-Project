const express = require("express");
const router = express.Router();
const Order = require('../controllers/orderController')



router.post("/createOrder",Order.createOrderController )
router.post("/verifyPayment",Order.verifyPaymentController )



module.exports = router;
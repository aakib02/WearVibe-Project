const router = require('express').Router()
const userController = require('../controllers/userController')
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const orderController = require('../controllers/orderController')
      // user routes
router.post('/createUser',userController.createUserController)
router.get('/readUser', userController.readUserController)
router.post('/loginUser',userController.loginController)


// create user order 
router.post('/createOrder', orderController.createOrderController)

module.exports = router
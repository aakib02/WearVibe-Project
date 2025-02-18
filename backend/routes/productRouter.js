const router = require('express').Router();
const productController = require('../controllers/productController');
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require('../middleware/multer')

router.post('/createProduct', authMiddleware, roleMiddleware(['vendor', 'admin']),upload.array('images'), productController.createProductController);
router.get('/getAllProduct',  productController.getProductController)
router.get('/getManProduct',productController.getManProductController)
router.get('/getWomanProduct',productController.getWomanProductController)
router.get('/getKidsProduct',productController.getKidsProductController)
router.get('/getCoupleProduct',productController.getCoupleProductController)
// router.get('/getAllBrands',productController.getAllBrands)

// add to cart  
router.post('/createCart',authMiddleware,productController.createCartController)
router.get("/getCart", authMiddleware,productController.getCartController )
router.delete("/removeFromCart",authMiddleware,productController.deleteCartController)



module.exports = router;

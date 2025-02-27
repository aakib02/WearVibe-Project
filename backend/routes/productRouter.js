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
router.get("/getProductDetails/:id",productController.getProductDetailsController)
// router.get('/getAllBrands',productController.getAllBrands)

// add to cart  
router.post('/createCart',authMiddleware,productController.createCartController)
router.get("/getCart",authMiddleware, productController.getCartController )
router.delete("/removeFromCart/:productId",authMiddleware,productController.deleteCartController)
router.get('/getBrand', productController.getBrandController)

router.post('/updateCart', authMiddleware,productController.updateCartController)

// vendor Product routes 
router.get('/getVendorProduct',authMiddleware,productController.getVendorProducts)
router.delete('/deleteVendorProduct/:id',authMiddleware,productController.deleteVendorProduct)
router.get('/getVendorProductById/:id',authMiddleware,productController.getVendorProductById)
router.put('/editVendorProduct/:id',authMiddleware,upload.array("images", 5),  productController.editVendorProduct)



// wishList routes 
router.post('/createWishList',authMiddleware,productController.createwishListController)
router.get("/getWishList",authMiddleware, productController.getwishListController )
router.delete("/removeFromWishList/:productId",authMiddleware,productController.deleteWishListController)
router.post('/updateWishList', authMiddleware,productController.updateWishListController)
module.exports = router;

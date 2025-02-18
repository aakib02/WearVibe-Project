const productSchema =  require('../models/productSchema')
// const brandSchema = require('../models/brandSchema')
const Cart = require('../models/cartSchema')
const vendorRegSchema = require('../models/vendorRegSchema')
const {errorResponse,successResponse} = require('../utils/response')
exports.createProductController = async (req,res)=>{
console.log(req.body);
console.log(req.files);
const {productName,price,description,sizes,discount,brandName,category,stock,colors,finalPrice}=req.body;
const images = req.files; 
console.log(brandName);
try {
   const productDetails = new productSchema({
    productName,
    price,
    description,
    sizes,
    discount,
    brandName,
    category,
    stock,
    colors,
    images:images.map(file => file.path),
    finalPrice
    // ratings
    })
   await productDetails.save()
   res.status(201).json({
    message:"Product created successfully",
   })
} catch (error) {
    res.status(500).json({
        message:"error in creating product",
        error:error.message
    })
}
}

// exports.createBrandController = async(req,res)=>{
//     console.log(req.body);
//     const {name,logo} = req.body
//     try {
//        const brand = new brandSchema({
//            name,
//            logo
//        })
//        await brand.save()
//        return successResponse(res,'brand created successfully',brand,201)
//     } catch (error) {
//        return errorResponse(res,'Error creating brand',{error:error.message},500)
//     }
//    }
   

   exports.getProductController = async(req,res)=>{
    try {
        const product = await productSchema.find()
        return successResponse(res,'products fetched successfully',product,200)
        
    } catch (error) {
        return errorResponse(res,'Error fetching products',{error:error.message},500)
    }

   }
   

exports.getManProductController = async(req,res)=>{
try {
    const ManProduct = await productSchema.find({category:"Men"})
    return successResponse(res,'Man products fetched successfully',ManProduct,200)
} catch (error) {
    return errorResponse(res,'man products not found',{error:error.message},500)
}
}
exports.getWomanProductController = async(req,res)=>{
try {
    const WomenProduct = await productSchema.find({category:"Women"})
    return successResponse(res,'Women products fetched successfully',WomenProduct,200)
} catch (error) {
    return errorResponse(res,'women products not found',{error:error.message},500)
}
}
exports.getKidsProductController = async(req,res)=>{
try {
    const KidsProduct = await productSchema.find({category:"Kids"})
    return successResponse(res,'kids products fetched successfully',KidsProduct,200)
} catch (error) {
    return errorResponse(res,'kids products not found',{error:error.message},500)
}
}
exports.getCoupleProductController = async(req,res)=>{
try {
    const CoupleProduct = await productSchema.find({category:"Couple"})
    return successResponse(res,'Couple products fetched successfully' ,CoupleProduct,200)
} catch (error) {
    return errorResponse(res,'Couple products not found',{error:error.message},500)
}
}


// exports.getAllBrands = async (req, res) => {
//     try {
//         let { brand } = req.query;
//         let filter = {};

//         if (brand) {
//             filter.brand = brand;
//         }

//         const products = await productSchema.find(filter);
//         res.json({ success: true, data: products });
//     } catch (error) {
//         console.error("Error fetching products:", error);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// };
exports.createCartController = async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { cart } = req.body;
        if (!cart || !Array.isArray(cart)) {
            return res.status(400).json({ success: false, message: "Invalid cart data" });
        }

        let userCart = await Cart.findOne({ userId });

        if (!userCart) {
            userCart = new Cart({ userId, items: [] });
        }

        for (const item of cart) {
            const existingItemIndex = userCart.items.findIndex(i => i.productId.toString() === item.id);
            
            if (existingItemIndex !== -1) {
                userCart.items[existingItemIndex].quantity += item.quantity;
            } else {
                userCart.items.push({
                    productId: item.id,
                    name: item.name,
                    price: item.price,
                    finalPrice: item.finalPrice,
                    image: item.image,
                    description: item.description,
                    category: item.category,
                    discount: item.discount,
                    colors: item.colors,
                    sizes: item.sizes,
                    quantity: item.quantity
                });
            }
        }

        // Update total quantity & price
        userCart.totalQuantity = userCart.items.reduce((sum, item) => sum + item.quantity, 0);
        userCart.totalPrice = userCart.items.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);

        await userCart.save();
        res.json({ success: true, message: "Cart synced successfully!" });
    } catch (error) {
        console.error("Cart Sync Error:", error);
        res.status(500).json({ success: false, message: "Cart sync failed!", error });
    }
};

exports.getCartController = async(req,res)=>{
    try {
        const userId = req.user.userId; // Middleware se userId mil rahi hai
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(200).json({ success: true, cart: [] });
        }

        res.json({ success: true, cart: cart.items });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
}

exports.deleteCartController = async (req, res) => {
    try {
 
        const { productId } = req.body;
        console.log(req.body,'productid is here');
        const userId = req.user.userId; // Authenticated user ID

        let cart = await Cart.findOne({ userId: userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

    

        // Remove item using _id
        cart.items = cart.items.filter(item => item._id.toString() !== productId);


        cart.markModified("items"); // Important to ensure Mongoose detects changes
        await cart.save();

        res.json({ success: true, message: "Item removed from cart" });
    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};




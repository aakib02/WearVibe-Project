const productSchema =  require('../models/productSchema')
const mongoose = require('mongoose')
// const brandSchema = require('../models/brandSchema')
const Cart = require('../models/cartSchema')
const vendorRegSchema = require('../models/vendorRegSchema')
const {errorResponse,successResponse} = require('../utils/response')
const brandSchema = require('../models/brandSchema')
const WishList = require('../models/wishListSchema')

const ObjectId = mongoose.Types.ObjectId; // <-- Add this line

// const { default: mongoose } = require('mongoose')


exports.createProductController = async (req,res)=>{
console.log(req.body,'create product');

const {productName,price,description,discount,category,stock,colors,finalPrice,brand}=req.body;
let sizes = req.body.sizes; 
if (typeof sizes === "string") {
    sizes = JSON.parse(sizes); 
}
const images = req.files; 
const vendorId = req.user.vendorId
try {
   const productDetails = new productSchema({
    productName,
    price,
    description,
    sizes,
    discount,
    category,
    stock,
    colors,
    images:images.map(file => file.path),
    finalPrice,
    vendor:vendorId,
    brand
    
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

   exports.getProductController = async(req,res)=>{
    try {
        const product = await productSchema.find()
        return successResponse(res,'products fetched successfully',product,200)
        
    } catch (error) {
        return errorResponse(res,'Error fetching products',{error:error.message},500)
    }

   }

  exports.getProductDetailsController =  async (req, res) => {
    try {
        const product = await productSchema.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
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



// cart functionality 

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
        const { productId } = req.params;
        const userId = req.user.userId;


        const productObjectId = new mongoose.Types.ObjectId(productId);

        const updatedCart = await Cart.findOneAndUpdate(
            { userId: new mongoose.Types.ObjectId(userId) }, 
            { $pull: { items: { _id: productObjectId } } }, // Change productId to _id
            { new: true }
        );
        

        if (!updatedCart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        console.log("Updated Cart after removal:", updatedCart);

        res.json({ success: true, message: "Item removed successfully", cart: updatedCart });
    } catch (error) {
        console.error("Error removing item from cart:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

exports.updateCartController = async (req, res) => {
    try {
        const { productId, action } = req.body;

        const userId = req.user.userId;
        let cart = await Cart.findOne({ userId });


        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        const product = cart.items.find(item => 
            item._id.toString() === productId || item.productId.toString() === productId
        );
        

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found in cart" });
        }

        if (action === "increment") {
            product.quantity += 1;
        } else if (action === "decrement") {
            if (product.quantity > 1) {
                product.quantity -= 1;
            } else {
                cart.items = cart.items.filter(item => item.productId.toString() !== productId);
            }
        }


        if (!product.finalPrice || !product.price || !product.name) {
            return res.status(400).json({ success: false, message: "Invalid product data in cart" });
        }


        cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((sum, item) => {

            return sum + (item.finalPrice ? item.finalPrice * item.quantity : 0);
        }, 0);

        await cart.save();
        res.json({ success: true, cart });

    } catch (error) {
        console.error("Cart update error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// brands  
exports.getBrandController = async(req,res)=>{
    try {
        const brands = await brandSchema.find({});
        res.json({
          success: true,
          brands: brands.map((brand) => brand.name), // Assuming brand schema has a 'name' field
        });
      } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
      }
}





// vendor Product actions => edit delete and get

// get vendor Product 

exports.getVendorProducts = async (req, res) => {
    try {
      const vendorId = req.user.vendorId; // JWT se vendor ID lena
  
      const products = await productSchema.find({ vendor: vendorId }).populate("brand");
  
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching products", error });
    }
  };

//   delete vendor product 
exports.deleteVendorProduct = async(req,res)=>{
    try {
        const productId = req.params.id;
        const deletedProduct = await productSchema.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error });
    }
}


// edit vendor product

// Ensure model import is correct
exports.getVendorProductById = async (req, res) => {
const id = req.params.id;
const getdata = await productSchema.findById(id)
if (!getdata) {
    return res.status(404).json({ message: "Product not found" });
}
return res.status(200).json(getdata);
}



exports.editVendorProduct =   async (req, res) => {
    try {

        console.log("Received Data:", req.body);  // ✅ Debug req.body
        console.log("Uploaded Files:", req.files); // ✅ Debug req.files
        const productId = req.params.id;
        const images = req.files; 
        const { productName, description, price, discount, finalPrice, category, brand, size, colors, stock } = req.body;

        let updateData = {
            productName,
            description,
            price,
            discount,
            finalPrice,
            category,
            brand,
            size,
            colors,
            stock,
            images:images.map(file => file.path),
        };


        const updatedProduct = await productSchema.findByIdAndUpdate(productId, updateData, { new: true, runValidators: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product updated successfully!", product: updatedProduct });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: "Error updating product", error: error.message });
    }
};

  


// wishlist  
exports.createwishListController = async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { wishList } = req.body;
        if (!wishList || !Array.isArray(wishList)) {
            return res.status(400).json({ success: false, message: "Invalid cart data" });
        }

        let userwishList = await WishList.findOne({ userId });

        if (!userwishList) {
            userwishList = new WishList({ userId, items: [] });
        }

        for (const item of wishList) {
            const existingItemIndex = userwishList.items.findIndex(i => i.productId.toString() === item.id);
            
            if (existingItemIndex !== -1) {
                userwishList.items[existingItemIndex].quantity += item.quantity;
            } else {
                userwishList.items.push({
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
        userwishList.totalQuantity = userwishList.items.reduce((sum, item) => sum + item.quantity, 0);
        userwishList.totalPrice = userwishList.items.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);

        await userwishList.save();
        res.json({ success: true, message: "Cart synced successfully!" });
    } catch (error) {
        console.error("Cart Sync Error:", error);
        res.status(500).json({ success: false, message: "Cart sync failed!", error });
    }
};


exports.getwishListController = async(req,res)=>{
    try {
        const userId = req.user.userId; // Middleware se userId mil rahi hai
        const wishList = await WishList.findOne({ userId });
        if (!wishList) {
            return res.status(200).json({ success: true, wishList: [] });
        }

        res.json({ success: true, wishList: wishList.items });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
}


exports.deleteWishListController = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.userId;


        const productObjectId = new mongoose.Types.ObjectId(productId);

        const updatedWishList = await WishList.findOneAndUpdate(
            { userId: new mongoose.Types.ObjectId(userId) }, 
            { $pull: { items: { _id: productObjectId } } }, // Change productId to _id
            { new: true }
        );
        

        if (!updatedWishList) {
            return res.status(404).json({ success: false, message: "WishList not found" });
        }

        console.log("Updated WishLi after removal:", updatedWishList);

        res.json({ success: true, message: "Item removed successfully", wishList: updatedWishList });
    } catch (error) {
        console.error("Error removing item from cart:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


exports.updateWishListController = async (req, res) => {
    try {
        const { productId, action } = req.body;

        const userId = req.user.userId;
        let wishList = await WishList.findOne({ userId });


        if (!wishList) {
            return res.status(404).json({ success: false, message: "wishlist not found" });
        }

        const product = wishList.items.find(item => 
            item._id.toString() === productId || item.productId.toString() === productId
        );
        

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found in wishlist" });
        }

        if (action === "increment") {
            product.quantity += 1;
        } else if (action === "decrement") {
            if (product.quantity > 1) {
                product.quantity -= 1;
            } else {
                wishList.items = wishList.items.filter(item => item.productId.toString() !== productId);
            }
        }


        if (!product.finalPrice || !product.price || !product.name) {  
            return res.status(400).json({ success: false, message: "Invalid product data in wishlist" });
        }


        wishList.totalQuantity = wishList.items.reduce((sum, item) => sum + item.quantity, 0);
        wishList.totalPrice = wishList.items.reduce((sum, item) => {

            return sum + (item.finalPrice ? item.finalPrice * item.quantity : 0);
        }, 0);

        await wishList.save();
        res.json({ success: true, wishList });

    } catch (error) {
        console.error("wishlist update error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};




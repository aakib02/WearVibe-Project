const Product = require('../models/productSchema');
const Order = require('../models/orderSchema');
const { successResponse, errorResponse } = require('../utils/response');
const userSchema = require('../models/UserSchema');

// create user order controller
exports.createOrderController = async (req, res) => {
    console.log(req.body);
    const { userId, products, shippingAddress, totalAmount, paymentStatus, orderStatus } = req.body;

    try {
        // User ko verify karein
        const user = await userSchema.findById(userId);
        if (!user) {
            return errorResponse(res, "User not found", 400);
        }

        const productDetails = [];

        // Products ko validate karein
        for (let i = 0; i < products.length; i++) {
            const product = await Product.findById(products[i].productId);
            if (!product) {
                return errorResponse(res, `Product with ID ${products[i].productId} not found`, 400);
            }
            productDetails.push({
                productId: product._id,
                quantity: products[i].quantity,
                price: product.price
            });
        }

        // Order create karein
        const order = new Order({
            userId,
            products: productDetails,
            totalAmount, // Use totalAmount from request body
            paymentStatus, // Use paymentStatus from request body
            orderStatus,   // Use orderStatus from request body
            shippingAddress,
        });

        await order.save();
        return successResponse(res, "Order created successfully", 201);
    } catch (error) {
        return errorResponse(res, "Internal Server Error", { error: error.message }, 500);
    }
};

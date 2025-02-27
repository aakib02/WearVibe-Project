const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            finalPrice: { type: Number, required: true },
            quantity: { type: Number, required: true },
            image: { type: [String], required: true },
            discount: { type: Number, default: 0 },
            category: { type: String },
            colors: { type: [String], default: [] },
            sizes: { type: [String], default: [] }
        }
    ],
    totalMRP: { type: Number, required: true },
    totalDiscount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    address: { type: String, required: true }, // Delivery Address
    status: { 
        type: String, 
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], 
        default: "Pending" 
    },
    paymentStatus: { 
        type: String, 
        enum: ["Pending", "Paid", "Failed"], 
        default: "Pending" 
    },
    paymentMethod: { type: String, enum: ["COD", "Online"], required: true },
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);

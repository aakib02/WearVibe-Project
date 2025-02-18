const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
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
            quantity: { type: Number, required: true, default: 1 },
            image: { type: [String], required: true },
            description: { type: String },
            category: { type: String },
            discount: { type: Number, default: 0 },
            colors: { type: [String], default: [] },
            sizes: { type: [String], default: [] }
        }
    ],
    totalQuantity: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Cart", CartSchema);

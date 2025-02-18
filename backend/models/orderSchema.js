const mongoose = require('mongoose')
// 🔹 Order Schema
const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
      }
    ],
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    orderStatus: { type: String, enum: ["pending", "shipped", "delivered", "cancelled"], default: "pending" },
    shippingAddress: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  });

  module.exports = mongoose.model("Order", orderSchema);
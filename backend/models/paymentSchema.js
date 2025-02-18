// 🔹 Payment Schema
const paymentSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["card", "UPI", "PayPal", "COD"], required: true },
    paymentStatus: { type: String, enum: ["success", "failed", "pending"], default: "pending" },
    transactionId: { type: String },
    createdAt: { type: Date, default: Date.now }
  });

  module.exports = mongoose.model("Payment", paymentSchema);
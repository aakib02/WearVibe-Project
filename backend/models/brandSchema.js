// 🔹 Brand Schema
const mongoose = require('mongoose')
const brandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Brand ka naam unique hoga
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" }, // Vendor ka reference
  createdAt: { type: Date, default: Date.now }
  });

  module.exports =  mongoose.model("Brand", brandSchema);
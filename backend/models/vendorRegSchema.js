const mongoose = require('mongoose');

const vendorRegSchema = new mongoose.Schema({
  vendorName: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  email: {
    type: String,
    required: true,
    trim: true,
    // unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email validation
},
  businessName: { 
    type: String, 
    required: true 
  },
  brandName: { 
    type: String, 
    required: true 
  },
  gstNumber: { 
    type: String, 
    required: true 
  },
  taxId: { 
    type: String, 
    required: true 
  },

  status: { 
    type: String, 
    enum: ["pending", "approved", "suspended"], 
    default: "pending" 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  // Additional Fields
  BusinessAddress: {
    street: String,
    city: String,
    state: String,
    zip: String,
    // country: String
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    // match: /^\+?[0-9]{10,15}$/, // International phone validation
},

});

module.exports = mongoose.model("Vendor", vendorRegSchema);

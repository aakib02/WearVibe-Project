const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
  productName: { type: String, },
    description: { type: String },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    finalPrice :{type:Number,},
    category: { type: String,required:true },
    // brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
    brand:{type:String,required:true},
    sizes: { type: [String], required:true  },
    colors: {type:[String],required:true},
    stock: { type: Number, default: 0 },
    images: { type: [String], required: true }, // Array of image URLs
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" }, 
    createdAt: { type: Date, default: Date.now }
  });

  module.exports = mongoose.model("Product", productSchema);
const vendorRegSchema = require('../models/vendorRegSchema')
const {successResponse,errorResponse} = require('../utils/response')
const userSchema = require('../models/UserSchema')
const brandSchema = require('../models/brandSchema')
// const mongoose = require('mongoose')

exports.createVendorController = async (req,res) =>{
const {vendorName,businessName,email,phone,gstNumber,taxId,brandName, businessAddress} = req.body



try {
    const user = await userSchema.findOne({fullName:vendorName});
    if (!user) {
        return errorResponse(res, "User not found with this name", 400);
    }


   

    const vendor = new vendorRegSchema({
        vendorName:user._id,
        businessName,
        businessAddress,
        phone,
        email,
        taxId,
        gstNumber,
        brandName,
        status:"pending"
    })

   await vendor.save()
        // Brand ko alag se store karein agar already exist nahi karta
        let brand = await brandSchema.findOne({ name: brandName });
        if (!brand) {
            brand = await brandSchema.create({ name: brandName, vendorId: vendor._id });
        }
    return successResponse(res,"Vendor created successfully",201)
} catch (error) {
    return errorResponse(res,"Error creating vendor",{error:error.message},500)
}
}


exports.updateVendorStatus = async (req, res) => {
    try {
        const vendor = await vendorRegSchema.findByIdAndUpdate(req.params.vendorId, { status: req.body.status }, { new: true });
       return successResponse(res,'successfully updated vendor status',vendor,200)
    } catch (err) {
      return  errorResponse(res,'server error',{err:err.message},500)
    }
};

exports.changeRole = async (req, res) => {
    try {
        const user = await userSchema.findByIdAndUpdate(req.params.userId, { role: req.body.role }, { new: true });
        res.json(user);
    } catch (err) {
        res.status(500).send('Server error');
    }
};

// Get vendor list
exports.getVendors = async (req, res) => {
    try {
        const vendors = await vendorRegSchema.find().populate('vendorName');
        return successResponse(res,'vendors list',vendors,200)
    } catch (err) {
        return errorResponse(res,'server error',{err:err.message},500)
    }
};



exports.getVendorBrandController = async (req, res) => {
    try {
        const vendorId = req.user.vendorId; // Token se vendorId milega
    console.log(vendorId,'vendor id recieved');
        if (!vendorId) {
            return errorResponse(res, 'Unauthorized access', {}, 401);
        }

        const brands = await brandSchema.find({ vendorId });
        return successResponse(res, 'Vendor specific brands', brands, 200);
    } catch (err) {
        return errorResponse(res, 'Server error', { err: err.message }, 500);
    }
};

exports.getVendorsController = async (req, res) => {
    try {
        const users = await vendorRegSchema.find().populate('vendorName')
        console.log(users);
        return successResponse(res, "Users retrieved successfully",users, 200);
    } catch (error) {
        return errorResponse(res, "Error retrieving users", { error: error.message }, 500)
    }
}










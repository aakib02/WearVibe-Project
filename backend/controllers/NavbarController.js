const User = require("../models/UserSchema");
const Product = require('../models/productSchema')
const brandSchema = require('../models/brandSchema');
const { successResponse, errorResponse } = require("../utils/response");
exports.getNavbarLinks = async (req, res) => {
    try {
        let navbarLinks = [
            { name:"All", path: "/all" },
            { name: "Man", path: "/man" },
            { name: "Woman", path: "/woman" },
            { name: "Kids", path: "/kids" },
            { name: "Couple", path: "/Couple" },
        ];
        res.json({navbarLinks})
    } catch (error) {
        errorResponse(res,'error in getNavlinks',{error:error.message},500)
    }
};


exports.getProfileController = async(req,res)=>{

try {
    console.log("Navbar API hit!");
    console.log("Request User:", req.user);  // ✅ Debugging req.user

    if (!req.user) {
        console.log("req.user is undefined!");
        return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user.userId);
    console.log("Fetched User:", user);

    if (!user) {
        console.log("User not found in DB");
        return res.status(404).json({ message: "User not found" });
    }

    // if (user.role === "vendor") {
    //     navbarLinks.push({ name: "Vendor Dashboard", path: "/vendor" });
    // }
    // if (user.role === "admin") {
    //     navbarLinks.push({ name: "Admin Dashboard", path: "/admin" });
    // }

       // ✅ Fetch brands from database
    //    const brands = await brandSchema.find({}, "name"); 



    res.json({ profile: { name: user.name, role: user.role },user });
} catch (error) {
    console.error("Error fetching navbar:", error);
    res.status(500).json({ message: "Server Error" });
}
}

exports.searchBarController = async (req, res) => {
    try {
        let { q, category, maxPrice } = req.query;
        maxPrice = parseInt(maxPrice) || 100000; // Default max price

        let filter = {
            finalPrice: { $lte: maxPrice }, // ✅ Filter products <= max price
            $or: [
                { productName: { $regex: q, $options: "i" } },
                { description: { $regex: q, $options: "i" } },
                { colors: { $regex: q, $options: "i" } }
            ]
        };

        if (category !== "all") {
            filter.category = category; // ✅ Apply category filter
        }

        const products = await Product.find(filter);
        res.json({ success: true, data: products });
    } catch (error) {
        console.error("Search Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



const userSchema = require('../models/UserSchema')
const { successResponse, errorResponse } = require('../utils/response')
const { hashPassword, compareHashpassword } = require('../utils/password')
const vendorRegSchema  =  require('../models/vendorRegSchema')
const jwt = require('jsonwebtoken')


exports.createUserController = async (req, res) => {
    console.log(req.body);
    const { fullName, email, password, confirmPassword, role = "customer" } = req.body;
    if (password !== confirmPassword) {
        return errorResponse(res, "password do not match", 400)
    }

    let hashedPassword;
    try {
        hashedPassword = await hashPassword(password);
    } catch (error) {
        return errorResponse(res, 'error while hashing password', 500)
    }
    try {
        // const hashedPassword = await hashPassword(password);
        const checkUserExist = await userSchema.findOne({email})
        if (checkUserExist) {
            return errorResponse(res, "User already exists", 400)
        }
        const user = new userSchema({
            fullName,
            email,
            password: hashedPassword,
            role
        })
        await user.save()
        return successResponse(res, "User created successfully", user, 201);
    } catch (error) {
        return errorResponse(res, "Error creating user",{error:error.message}, 500)
    }
}

exports.readUserController = async (req, res) => {
    try {
        const users = await userSchema.find()
        return successResponse(res, "Users retrieved successfully",users, 200);
    } catch (error) {
        return errorResponse(res, "Error retrieving users", { error: error.message }, 500)
    }
}

exports.loginController = async (req, res) => {
    const { email, password } = req.body;
    try {
        const checkUserExist = await userSchema.findOne({ email });
        if (!checkUserExist) {
            return errorResponse(res, "User not found", { email: "Please register first" }, 404);
        }

        const isPasswordMatch = await compareHashpassword(password, checkUserExist.password);
        if (!isPasswordMatch) {
            return errorResponse(res, "Invalid credentials", { password: "Email and password do not match" }, 401);
        }

        const vendor = await vendorRegSchema.findOne({ vendorName: checkUserExist._id });
          // ✅ Ensure vendorId exists
          const vendorId = vendor ? vendor._id : null;

        // Generate JWT token
        const token = jwt.sign(
            { userId: checkUserExist._id, role: checkUserExist.role ,vendorId},
            process.env.JWT_SECRET || "my name is khan",
            { expiresIn: "7d" }
        );
        console.log(token);

        // Send token as a cookie
        res.cookie('token', token, {
            httpOnly: true,  // Prevents access to cookie from JavaScript
            secure: process.env.NODE_ENV === 'production',  // Set to true if using HTTPS
            maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
            sameSite: 'Strict'  // Makes the cookie only sent in first-party contexts
        });

        return successResponse(res, "User successfully logged in", { 
            token,
            role:checkUserExist.role
        });

    } catch (error) {
        return errorResponse(res, "Error in user login", error.message, 500);
    }
};







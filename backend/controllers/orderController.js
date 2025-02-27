const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

// Razorpay instance create karo
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Order create API
exports.createOrderController =  async (req, res) => {
    try {
        const { amount, currency } = req.body;

        const options = {
            amount: amount * 100, 
            currency: currency || "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json({ success: true, order });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Order creation failed" });
    }
};

exports.verifyPaymentController = (req,res)=>{
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature === razorpay_signature) {
            res.status(200).json({ success: true, message: "Payment Verified Successfully" });
        } else {
            res.status(400).json({ success: false, message: "Invalid Signature" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Payment verification failed" });
    }

}

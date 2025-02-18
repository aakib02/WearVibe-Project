const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token || req.header("Authorization")?.split(" ")[1];
    console.log("Token received in backend:", token); 
    if (!token) {
        return res.status(401).json({ message: "Access Denied, No Token Provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  
        next();
    } catch (error) {
        return res.status(400).json({ message: "Invalid Token" });
    }
};

module.exports = authMiddleware;

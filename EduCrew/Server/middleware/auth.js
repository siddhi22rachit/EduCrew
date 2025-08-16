import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt; 
    // console.log("🔹 Received Token:", token);
    
    if (!token) {
        return next(createError(403, "No token provided"));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
        };
        
        // console.log("✅ Decoded Token:", decoded);
        req.user = decoded; // Attach user to request
        next();
    } catch (error) {
        console.error("❌ JWT Verification Failed:", error.message);
        return next(createError(403, "Token is not valid"));
    }
};

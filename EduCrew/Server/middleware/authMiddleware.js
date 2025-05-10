import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    let token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];

    // console.log("🔹 Incoming Token:", token);

    if (!token) {
      console.log("❌ No token provided");
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("✅ Decoded Token:", decoded);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      console.log("❌ User not found in database");
      return res.status(404).json({ message: "Unauthorized - User not found" });
    }

    req.user = user;
    // console.log("✅ User Authenticated:", req.user);
    next();
  } catch (error) {
    console.error("❌ Error in protectRoute:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


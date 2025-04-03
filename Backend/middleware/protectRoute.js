// protectroute.js
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Lawyers from "../models/lawyer.model.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ msg: "No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    const lawyer = await Lawyers.findById(decoded.userId).select("-password");
    if (!user && !lawyer) {
      return res.status(401).json({ msg: "User or lawyer not found" });
    }
    req.user = user || lawyer;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Unauthorized" });
  }
};

export { protectRoute };
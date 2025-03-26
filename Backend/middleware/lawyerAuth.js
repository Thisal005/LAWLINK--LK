import jwt from "jsonwebtoken";
import Lawyer from "../models/lawyer.model.js";

const lawyerAuth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ msg: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ msg: "Unauthorized" });
        }

        const lawyer = await Lawyer.findById(decoded.userId).select("-password");
        if (!lawyer) {
            return res.status(401).json({ msg: "Lawyer not found" });
        }

        req.lawyer = lawyer;
        next();
    } catch (err) {
        console.log("Error in lawyerAuth middleware:", err.message);
        res.status(401).json({ msg: "Unauthorized" });
    }
};

export default lawyerAuth;
import jwt from 'jsonwebtoken';


const userAuth = async (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ msg: "Unauthorized nk" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = decoded.userId;
        console.log("Decoded User ID:", decoded.userId);

        next();
    } catch (err) {
        console.error("Error in userAuth middleware:", err.message);
        res.status(401).json({ msg: "Unauthorized fk" });
    }
};

export default userAuth;

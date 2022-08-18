const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.header("x-auth-token");

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, "secret");
        req.user = decoded.data;
        next();
    } catch (e) {
        return res.status(401).json({ e, message: "Unauthorized" });
    }
};

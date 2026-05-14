const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({ message: "ไม่สามารถเข้าได้ ไม่มี Token" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "Token ไม่ถูกต้อง หรือหมดอายุ" });
    }
    req.user = decoded;

    next();
  });
};

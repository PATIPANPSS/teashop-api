const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "ยินดีต้อนรับเข้าสู่ระบบ",
    userData: req.user,
  });
});

module.exports = router;

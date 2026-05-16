const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { body } = require("express-validator");

router.post(
  "/register",
  [
    body("username")
      .isLength({ min: 3 })
      .withMessage("ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
  ],
  authController.registerUser,
);
router.post("/login", authController.loginUser);

router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "ยินดีต้อนรับเข้าสู่ระบบ",
    userData: req.user,
  });
});

module.exports = router;

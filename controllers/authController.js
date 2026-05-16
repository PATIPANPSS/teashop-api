const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

exports.registerUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const { username, password, name } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db
      .promise()
      .query("INSERT INTO user (username, password, name) VALUES (?, ?, ?)", [
        username,
        hashedPassword,
        name,
      ]);

    res.status(201).json({ message: "ลงทะเบียนสำเร็จ" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "ลงทะเบียนล้มเหลว" });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM user WHERE username = ?", [username]);

    if (rows.length === 0) {
      return res
        .status(401)
        .json({ message: "username หรือ password ไม่ถูกต้อง" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "username หรือ password ไม่ถูกต้อง" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.status(200).json({
      message: "เข้าสู่ระบบสำเร็จ",
      token: token,
      user: { id: user.id, username: user.username, name: user.name },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "เข้าระบบล้มเหลว" });
  }
};

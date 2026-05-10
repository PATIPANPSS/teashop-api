const db = require("../config/db");

exports.registerCustomer = async (req, res) => {
  const { name, phone } = req.body;

  try {
    const [results] = await db
      .promise()
      .query("INSERT INTO customers (name, phone) VALUES (?, ?)", [
        name,
        phone,
      ]);

    res.status(201).json({
      message: "สมัครสมาชิกสำเร็จ",
      customer_id: results.insertId,
      name: name,
    });
  } catch (error) {
    console.error(error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "เบอร์โทรนี้มีคนใช้แล้ว" });
    }
    res.status(500).json({ error: "สมัครสมาชิกล้มเหลว" });
  }
};

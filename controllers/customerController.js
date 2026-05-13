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

exports.getAllCustomers = async (req, res) => {
  try {
    const [results] = await db.promise().query("SELECT * FROM customers");
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "ดึงข้อมูลล้มเหลว" });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await db
      .promise()
      .query("SELECT * FROM customers WHERE id = ?", [id]);

    if (results.length === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลลูกค้าคนนี้" });
    }
    res.json(results[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "ดึงข้อมูล ID ล้มเหลว" });
  }
};

const db = require("../config/db");

exports.registerCustomer = async (req, res) => {
  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }
  if (phone.length != 10) {
    return res.status(400).json({ message: "เบอร์โทรศัพท์ต้องมี 10 หลัก" });
  }

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
  const { id } = req.params;
  try {
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

exports.updateCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    const { name, phone } = req.body;
    const [results] = await db
      .promise()
      .query("UPDATE customers SET name = ?, phone = ? WHERE id = ?", [
        name,
        phone,
        id,
      ]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลลูกค้าคนนี้" });
    }
    res.json({ message: "อัปเดตข้อมูลสำเร็จ", id, name, phone });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "อัปเดตข้อมูลล้มเหลว" });
  }
};

exports.deleteCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await db
      .promise()
      .query("DELETE FROM customers WHERE id = ?", [id]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลลูกค้าคนนี้" });
    }
    res.json({ message: "ลบข้อมูลสำเร็จ", id });
  } catch (error) {
    if (error.errno === 1451) {
      return res.status(400).json({
        message:
          "ไม่สามารถลบลูกค้ารายนี้ได้ เนื่องจากยังมีประวัติการสั่งซื้ออยู่ในระบบ",
      });
    }

    console.error(error);
    res.status(500).json({ error: "ลบข้อมูลล้มเหลว" });
  }
};

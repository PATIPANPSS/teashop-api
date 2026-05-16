const db = require("../config/db");

exports.getAllDrinks = async (req, res) => {
  try {
    const [results] = await db.promise().query("SELECT * FROM drinks");
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "ดึงข้อมูลจากฐานข้อมูลล้มเหลว" });
  }
};

exports.searchDrinks = async (req, res) => {
  const keyword = req.query.name;
  if (!keyword) {
    return res.status(400).json({ error: "กรุณาส่งคำค้นหา (?name=...)" });
  }
  try {
    const [results] = await db
      .promise()
      .query("SELECT * FROM drinks WHERE name LIKE ?", [`%${keyword}%`]);
    if (results.length === 0) {
      return res.status(404).json({ message: "ไม่พบเหมนูที่ค้นหา" });
    }
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "ค้นหาข้อมูลล้มเหลว" });
  }
};

exports.getDrinksById = async (req, res) => {
  const targetId = parseInt(req.params.id);
  try {
    const [results] = await db
      .promise()
      .query("SELECT * FROM drinks WHERE id = ?", [targetId]);
    if (results.length === 0) {
      return res.status(404).json({ error: "หาเหมนูไม่เจอ" });
    }
    res.json(results[0]);
  } catch (error) {
    console.error(error);
    res.status(505).json({ error: "ดึงข้อมูลล้มเหลว" });
  }
};

exports.addDrink = async (req, res) => {
  const { name, price, quantity } = req.body;
  let imageName = null;

  if (req.file) {
    imageName = req.file.filename;
  }

  try {
    const [results] = await db
      .promise()
      .query(
        "INSERT INTO drinks (name, price, quantity, image) VALUES (?, ?, ?, ?)",
        [name, price, quantity, imageName]
      );
    res
      .status(201)
      .json({
        message: "เพิ่มเมนูสำเร็จ",
        id: results.insertId,
        imageSaved: imageName
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "เพิ่มข้อมูลล้มเหลว" });
  }
};

exports.updateDrink = async (req, res) => {
  const targetId = parseInt(req.params.id);
  const updateData = req.body;
  try {
    const [results] = await db
      .promise()
      .query(
        "UPDATE drinks SET name = ?, price = ?, quantity = ? WHERE id = ?",
        [updateData.name, updateData.price, updateData.quantity, targetId],
      );
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "หาเมนูนี้ไม่เจอ" });
    }
    res.json({ message: `แก้ไขเมนู ID ${targetId} สำเร็จ` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "แก้ไขข้อมุลล้มเหลว" });
  }
};

exports.deleteDrink = async (req, res) => {
  const targetId = parseInt(req.params.id);
  try {
    const [results] = await db
      .promise()
      .query("DELETE FROM drinks WHERE id = ?", [targetId]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "หาเมนูไม่เจอ" });
    }
    res.json({ message: `ลบเมนู ID ${targetId} สำเร็จ` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "ลบข้อมูลล้มเหลว" });
  }
};

exports.buyDrink = async (req, res) => {
  const targetId = parseInt(req.params.id);
  const amount = req.body.quantity;
  try {
    const [results] = await db
      .promise()
      .query("SELECT * FROM drinks WHERE id = ?", [targetId]);
    if (results.length === 0) {
      return res.status(404).json({ error: "ไม่มีเมนูนี้" });
    }
    if (results[0].quantity < amount) {
      return res.status(400).json({ message: "ของในสต็อกไม่พอ!" });
    }

    const drink = results[0];
    const newStock = drink.quantity - amount;
    const totalPrice = drink.price * amount;
    await db
      .promise()
      .query("UPDATE drinks SET quantity = ? WHERE id = ?", [
        newStock,
        targetId,
      ]);
    await db
      .promise()
      .query(
        "INSERT INTO orders (drink_id, amount, total_price) VALUES (?, ?, ?)",
        [targetId, amount, totalPrice],
      );
    res.json({
      message: `ซื้อสำเร็จ ยอดคงเหลือ ${newStock}`,
      receipt: {
        menu: drink.name,
        amount: amount,
        totalPrice: totalPrice,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "ระบบซื้อขายขัดข้อง" });
  }
};

exports.getSalesHistory = async (req, res) => {
  try {
    const sql = `SELECT orders.id AS order_id, drinks.name AS menu_name, orders.amount, orders.total_price, orders.created_at FROM orders JOIN drinks ON orders.drink_id = drinks.id ORDER BY orders.created_at DESC`;

    const [results] = await db.promise().query(sql);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "ดึงประวัติการขายล้มเหลว" });
  }
};

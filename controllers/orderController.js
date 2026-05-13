const db = require("../config/db");

exports.createOrder = async (req, res) => {
  const { customer_id, drink_id, amount } = req.body;
  const connection = await db.promise().getConnection();

  try {
    await connection.beginTransaction();

    const [drinkResults] = await connection.query(
      "SELECT price FROM drinks WHERE id = ?",
      [drink_id],
    );

    if (drinkResults.length === 0) {
      return res.status(404).json({ message: "ไม่มีเมนูชานี้ในระบบ" });
    }

    const officialPrice = drinkResults[0].price;
    const finallyTotalPrice = officialPrice * amount;

    await connection.query(
      "INSERT INTO orders (customer_id, drink_id, amount, total_price) VALUES (?, ?, ?, ?)",
      [customer_id, drink_id, amount, finallyTotalPrice],
    );
    await connection.query(
      "UPDATE customers SET points = points + 1 WHERE id = ?",
      [customer_id],
    );
    await connection.commit();
    res
      .status(201)
      .json({
        message: "สั่งซื้อสำเร็จ! และบวกแต้มให้ลูกค้าแล้ว",
        total_paid: finallyTotalPrice,
      });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res
      .status(500)
      .json({ error: "ระบบสั่งซื้อขัดข้อง ยกเลิกรายการทั้งหมดแล้ว" });
  } finally {
    connection.release();
  }
};

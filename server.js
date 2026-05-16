require('dotenv').config();
const express = require("express");
const app = express();
const db = require('./config/db');
const drinkRoutes = require('./routes/drinkRoutes');
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const upload = require('./middlewares/uploadMiddleware');
const path = require('path');

app.use(express.json());

app.use(function (req, res, next) {
  const time = new Date().toLocaleString();

  console.log(`[${time}] มีคนมาใช้งาน: ${req.method} ${req.url}`);

  next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/drinks', drinkRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

app.post('/api/upload-test', upload.single('image'), (req, res) => {
  if(!req.file){
    return res.status(400).json({ message: "กรุณาแนบไฟล์รูปภาพมาด้วย"});
  }

  res.status(200).json({
    message: "อัปโหลดรูปภาพสำเร็จ",
    fileInfo: {
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size
    }
  });
});

app.listen(3000, function () {
  console.log("Server is running...");
});

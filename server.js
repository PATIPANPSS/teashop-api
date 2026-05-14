require('dotenv').config();
const express = require("express");
const app = express();
const db = require('./config/db');
const drinkRoutes = require('./routes/drinkRoutes');
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(express.json());

app.use(function (req, res, next) {
  const time = new Date().toLocaleString();

  console.log(`[${time}] มีคนมาใช้งาน: ${req.method} ${req.url}`);

  next();
});

app.use('/api/drinks', drinkRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

app.listen(3000, function () {
  console.log("Server is running...");
});

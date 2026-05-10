const express = require("express");
const app = express();
const db = require('./config/db');
const drinkRoutes = require('./routes/drinkRoutes');

app.use(express.json());

app.use(function (req, res, next) {
  const time = new Date().toLocaleString();

  console.log(`[${time}] มีคนมาใช้งาน: ${req.method} ${req.url}`);

  next();
});

app.use('/api/drinks', drinkRoutes);

app.listen(3000, function () {
  console.log("Server is running...");
});

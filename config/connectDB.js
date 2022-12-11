const mongoose = require("mongoose");
require("dotenv").config({ path: "./config/.env" });



function connectDB() {
//   const uri = process.env.MONGO_URI;    // cloud DB
    const uri = process.env.MONGOURI;      // local DB
  mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Database is connected successfully");
    })
    .catch(() => {
      console.error("Error to connect to the Database!");
    });
}

module.exports = connectDB;
const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.log("⚠️ MONGO_URI environment variable is missing. Operating in Local JSON file database mode.");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Atlas Connected");
  } catch (error) {
    console.error("Database connection failed, operating in Local JSON file database mode:", error.message);
  }
};

module.exports = connectDB;
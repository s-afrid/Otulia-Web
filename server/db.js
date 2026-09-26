const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDb connected");
  } catch (error) {
    console.error("MongoDB initial connection error:", error.message);
    setTimeout(connectDB, 10000);
  }
};

module.exports = connectDB;

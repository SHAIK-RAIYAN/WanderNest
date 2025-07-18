// seedDB/seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const User = require("../models/user");
const listingsData = require("../init/data"); // ← this is now an Array

async function seedDB() {
  try {
    await mongoose.connect(process.env.ATLAS_DB_URL);
    console.log("🗄️  Connected to MongoDB Atlas");

    const adminId = new mongoose.Types.ObjectId("687a7f847d667104c4037a6b");
    const admin = await User.findById(adminId);
    if (!admin) {
      throw new Error(`No User found with _id ${adminId}`);
    }

    await Listing.deleteMany({});
    console.log("🗑️  Cleared listings collection");

    const withOwner = listingsData.map((listing) => ({
      ...listing,
      owner: admin._id,
    }));
    const inserted = await Listing.insertMany(withOwner);
    console.log(`✅  Inserted ${inserted.length} listings`);
  } catch (e) {
    console.error("❌  Seed error:", e);
  } finally {
    await mongoose.disconnect();
    console.log("🔌  Disconnected from MongoDB");
  }
}

seedDB();

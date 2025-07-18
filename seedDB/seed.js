// seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("../models/listing"); // adjust path if needed
const data = require("../init/data"); // your data.js exporting an array of listing objects

async function seedDB() {
  try {
    await mongoose.connect(process.env.ATLAS_DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("🗄️  Connected to MongoDB Atlas");

    // wipe existing
    await Listing.deleteMany({});
    console.log("🗑️  Cleared listings collection");

    // insert new
    const inserted = await Listing.insertMany(data);
    console.log(`✅  Inserted ${inserted.length} listings`);
  } catch (e) {
    console.error("❌  Seed error:", e);
  } finally {
    await mongoose.disconnect();
    console.log("🔌  Disconnected from MongoDB");
  }
}

seedDB();

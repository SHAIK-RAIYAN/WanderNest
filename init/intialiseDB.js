const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/WanderNest";

const Listing = require("../models/listing");
const initdata = require("./data");

main()
  .then((res) => {
    console.log("Connection succcessful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("data intialised");
};

initDB();

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
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "6874e601485ebfa7e4c1a07c",
  })); //assigning owner for all listings
  await Listing.insertMany(initdata.data);
  console.log("data intialised");
};

initDB();

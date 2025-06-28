const express = require("express");
const app = express();

const path = require("path");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// MODELS
const Listing = require("./models/listing.js");

const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/WanderNest";
main()
  .then((res) => {
    console.log("Connection succcessful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const port = 3000;
app.listen(port, () => {
  console.log(`WanderNest server running on http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.send("root page !!!!!!!!");
  //   res.render("home");
});

app.get("/test", async (req, res) => {
  let samplehotel = new Listing({
    title: "My sample Villa",
    description: "By the beach",
    price: 1200,
    location: "Calangute, Goa",
    country: "India",
  });

  await samplehotel.save().then((res) => {
    console.log(res);
  });
  res.send("sample data saved");
});

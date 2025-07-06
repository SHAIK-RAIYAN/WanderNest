const express = require("express");
const app = express();

const path = require("path");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

// MODELS
const Listing = require("./models/listing.js");
// error handling
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError");

// mongoose connectioon
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

// root page
app.get("/", (req, res) => {
  res.send("root page !!!!!!!!");
  //   res.render("home");
});

// initialise data
app.get(
  "/test",
  wrapAsync(async (req, res) => {
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
  })
);

// index route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    let alllistings = await Listing.find({});
    res.render("listings/index.ejs", { alllistings });
  })
);

// new hotel btn from index.ejs
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});

//show list route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let hotel = await Listing.findById(id);
    res.render("listings/show.ejs", { hotel });
  })
);

// create new listing from new.ejs
app.post(
  "/listings",
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      next(new ExpressError(400, "send Valid Data"));
    }
    const newListing = new Listing(req.body.listing);

    await newListing.save();
    res.redirect("/listings");
  })
);

app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
  })
);

app.put(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body.listing;

    // If image is empty string, set it to default image
    if (!updatedData.image) {
      updatedData.image = {
        url: "https://img.freepik.com/premium-vector/no-photos-icon-vector-image-can-be-used-spa_120816-264914.jpg?w=1380",
      };
    } else {
      // If image is string (not object), convert to correct format
      updatedData.image = { url: updatedData.image };
    }

    await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listings/${id}`);
  })
);

app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

//errors
app.all("{*splat}", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;
  res.status(status).send(message);
});


//Before Restructuring the project
//Before Express Router
// all routes in index.js
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
const Review = require("./models/review");

// error handling
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError");

//Joi error message handling
const { listingSchema, reviewSchema } = require("./utils/schemas");
// middleware function/validateListing
//to validate our input data
function validateListing(req, res, next) {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((ele) => ele.message).join(", ");
    throw new ExpressError(400, msg);
  }
  next();
}
function validateLReview(req, res, next) {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((ele) => ele.message).join(", ");
    throw new ExpressError(400, msg);
  }
  next();
}

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
    let hotel = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { hotel });
  })
);

// create new listing from new.ejs
app.post(
  "/listings",
  validateListing,
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
  validateListing,
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

// Delete listing and also its reviews
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    //automatically all reviews are deleted from this listing as post middleware is defines in /model/listing.js
    res.redirect("/listings");
  })
);

// POST route to add a review
app.post(
  "/listings/:id/reviews",
  validateLReview,
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const { comment, rating } = req.body.review;
    const review = new Review({ comment, rating });

    listing.reviews.push(review);
    await review.save();
    await listing.save();

    console.log("review saved");
    res.redirect(`/listings/${listing._id}`);
  })
);

// Delete a review and alsofrom listing
app.delete(
  "/listings/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
  })
);

//keep this part at end
//errors Handling
app.all("{*splat}", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("listings/error.ejs", { status, message });
});
////////

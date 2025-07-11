const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");

//Joi error message handling
const { listingSchema } = require("../utils/schemas");
const ExpressError = require("../utils/ExpressError");

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

// index route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    let alllistings = await Listing.find({});
    res.render("listings/index.ejs", { alllistings });
  })
);

// new hotel btn from index.ejs
router.get("/new", (req, res) => {
  res.render("listings/new");
});

//show list route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let hotel = await Listing.findById(id).populate("reviews");
    if (!hotel) {
      req.flash("error", "Listing you requested for does not exist!.");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { hotel });
  })
);

// create new listing from new.ejs
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      next(new ExpressError(400, "send Valid Data"));
    }
    const newListing = new Listing(req.body.listing);

    await newListing.save();
    req.flash("success", "Listing created successfully.");
 //adding flash msg when new listing is added
    res.redirect("/listings");
  })
);

//edit route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!.");
      return res.redirect("/listings");
    }
    res.render("listings/edit", { listing });
  })
);

router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body.listing;

    // If image is empty string, set it to default image
    if (
      !updatedData.image ||
      !updatedData.image.url
    ) {
      updatedData.image = {
        url: "https://img.freepik.com/premium-vector/no-photos-icon-vector-image-can-be-used-spa_120816-264914.jpg?w=1380",
      };
    } 

    await Listing.findByIdAndUpdate(id, req.body.listing);
    req.flash("success", "Listing updated successfully.");
//flash msg
    res.redirect(`/listings/${id}`);
  })
);

// Delete listing and also its reviews
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    //automatically all reviews are deleted from this listing as post middleware is defines in /model/listing.js
    req.flash("success", "Listing deleted successfully.");
// Flash message
    res.redirect("/listings");
  })
);

module.exports = router;

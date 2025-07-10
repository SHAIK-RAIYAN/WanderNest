const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");

//Joi error message handling
const { reviewSchema } = require("../utils/schemas");

// middleware function/validateReview
//to validate our input review
function validateLReview(req, res, next) {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((ele) => ele.message).join(", ");
    throw new ExpressError(400, msg);
  }
  next();
}

// POST route to add a review
router.post(
  "/",
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
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;

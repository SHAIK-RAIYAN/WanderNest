const Review = require("../models/review");
const Listing = require("../models/listing.js");

module.exports.addReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const { comment, rating } = req.body.review;
  const review = new Review({ comment, rating, author: req.user._id });

  listing.reviews.push(review);
  await review.save();
  await listing.save();

  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/listings/${id}`);
};

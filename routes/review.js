const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview } = require("../middleware/validate.js");

//loading middlewares
const {
  isLoggedIn,
  isReviewAuthorOrAdmin,
} = require("../middleware/middleware");

const reviewController = require("../controllers/review.js");

// POST route to add a review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.addReview)
);

// Delete a review and alsofrom listing
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthorOrAdmin,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;

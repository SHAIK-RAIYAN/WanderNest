const Listing = require("../models/listing");
const Review = require("../models/review");

// checking if user in logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    if (req.method === "GET") {
      req.session.returnTo = req.originalUrl;
    } else if (req.method === "POST") {
      // fallback: redirect to parent GET page
      const listingId = req.params.id;
      req.session.returnTo = `/listings/${listingId}`;
    }
    req.flash("error", "You must be logged in.");
    return res.redirect("/login");
  }
  next();
};

//storing redirecting path to send user to same path from where he came to login page
module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports.isListingOwnerOrAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash(
        "error",
        "The listing you are trying to access does not exist."
      );
      return res.redirect("/listings");
    }
    if (listing.owner.equals(req.user._id) || req.user.isAdmin) {
      return next();
    }
    req.flash("error", "You do not have permission to modify this listing");
    return res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong. Please try again.");
    res.redirect("/listings");
  }
};

module.exports.isReviewAuthorOrAdmin = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect(`/listings/${id}`);
  }
  if (review.author.equals(req.user._id) || req.user.isAdmin) {
    return next();
  }
  req.flash("error", "You do not have permission");
  return res.redirect(`/listings/${id}`);
};

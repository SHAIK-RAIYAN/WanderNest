//Joi error message handling
const { reviewSchema } = require("../utils/schemas");
const { listingSchema } = require("../utils/schemas");

// middleware function/validateListing
//to validate our input data
module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((ele) => ele.message).join(", ");
    throw new ExpressError(400, msg);
  }
  next();
};

// middleware function/validateReview
//to validate our input review
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((ele) => ele.message).join(", ");
    throw new ExpressError(400, msg);
  }
  next();
};

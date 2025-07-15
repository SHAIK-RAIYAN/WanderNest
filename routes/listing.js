const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
//Joi error message handling
const { validateListing } = require("../middleware/validate.js");

const {
  isLoggedIn,
  isListingOwnerOrAdmin,
} = require("../middleware/middleware.js");

const listingController = require("../controllers/listing.js");

router
  .route("/")
  .get(wrapAsync(listingController.index)) //index route
  .post(
    // create new listing from new.ejs
    isLoggedIn,
    validateListing,
    wrapAsync(listingController.createListing)
  );

// new hotel btn from index.ejs
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing)) //show list route
  .put(
    //updateListing
    isLoggedIn,
    isListingOwnerOrAdmin,
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    // Delete listing and also its reviews
    isLoggedIn,
    isListingOwnerOrAdmin,
    wrapAsync(listingController.deleteListing)
  );

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;

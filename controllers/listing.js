const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError");


module.exports.index = async (req, res) => {
  let alllistings = await Listing.find({});
  res.render("listings/index.ejs", { alllistings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let hotel = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate({ path: "owner", select: "username profileImage createdAt" });
  if (!hotel) {
    req.flash("error", "Listing you requested for does not exist!.");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { hotel });
};

module.exports.createListing = async (req, res) => {
  if (!req.body.listing) {
    next(new ExpressError(400, "send Valid Data"));
  }
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; // Assign the log-in user as owner
  await newListing.save();
  req.flash("success", "Listing created successfully.");
  //adding flash msg when new listing is added
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!.");
    return res.redirect("/listings");
  }
  res.render("listings/edit", { listing });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body.listing;

  // If image is empty string, set it to default image
  if (!updatedData.image || !updatedData.image.url) {
    updatedData.image = {
      url: "https://img.freepik.com/premium-vector/no-photos-icon-vector-image-can-be-used-spa_120816-264914.jpg?w=1380",
    };
  }

  await Listing.findByIdAndUpdate(id, req.body.listing);
  req.flash("success", "Listing updated successfully.");
  //flash msg
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  //automatically all reviews are deleted from this listing as post middleware is defines in /model/listing.js
  req.flash("success", "Listing deleted successfully.");
  // Flash message
  res.redirect("/listings");
};

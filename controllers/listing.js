const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError");
const { cloudinary } = require("../cloudConfig/cloudinary");

// function to geocode via Nominatim
async function geocodeLocation(location) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    location
  )}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "WanderNest/1.0 (your-email@example.com)",
      "Accept-Language": "en",
    },
  });

  if (!res.ok) {
    console.error(`Geocoding failed (${res.status}): ${await res.text()}`);
    return null;
  }

  const data = await res.json();

  if (!data || data.length === 0) {
    // no geo data
    return null;
  }

  const { lat, lon } = data[0];
  return { type: "Point", coordinates: [parseFloat(lon), parseFloat(lat)] };
}

//escapeRegex helper
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports.index = async (req, res) => {
  //pagination setup
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit; //how many to skip in page

  //search functionality
  const { search } = req.query;
  let filter = {};
  if (search && search.trim() !== "") {
    const regex = new RegExp(escapeRegex(search), "i"); // case‑insensitive
    filter = {
      $or: [{ title: regex }, { location: regex }, { country: regex }],
    };
  }

  const alllistings = await Listing.find(filter).skip(skip).limit(limit).lean(); //lean() converts Mongoose docs to plain JS objects

  const totalListings = await Listing.countDocuments(filter);
  const totalPages = Math.ceil(totalListings / limit);

  res.render("listings/index.ejs", {
    alllistings,
    search: search || "",
    currentPage: page,
    totalPages: totalPages,
  });
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
    req.flash(
      "error",
      "The stay you're looking for doesn't exist or may have been removed."
    );
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { hotel });
};

module.exports.createListing = async (req, res, next) => {
  if (!req.body.listing) {
    return next(new ExpressError(400, "Invalid listing data provided."));
  }
  const newListing = new Listing(req.body.listing);

  // geocode once
  const geo = await geocodeLocation(req.body.listing.location);
  if (!geo) {
    req.flash(
      "error",
      `We couldn't locate "${req.body.listing.location}". Please provide a valid location`
    );
    return res.redirect("/listings/new");
  }
  newListing.geometry = geo;

  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  newListing.owner = req.user._id; // Assign the log-in user as owner
  await newListing.save();
  req.flash(
    "success",
    "Your property has been successfully listed on WanderNest."
  );
  //adding flash msg when new listing is added
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash(
      "error",
      "The stay you're looking for doesn't exist or may have been removed."
    );
    return res.redirect("/listings");
  }

  res.render("listings/edit", { listing });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body.listing;

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "We couldn't find that stay.");
    return res.redirect("/listings");
  }
  const originalLocation = listing.location;

  // Update basic fields
  Object.assign(listing, updatedData);

  // If a new image was uploaded
  if (req.file) {
    // Delete the old image from Cloudinary
    if (listing.image?.filename) {
      await cloudinary.uploader.destroy(listing.image.filename);
    }
    // Assign new image
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  // If no image in form & no previous image, assign default
  if (!req.file && (!listing.image || !listing.image.url)) {
    listing.image = {
      url: "https://img.freepik.com/premium-vector/no-photos-icon-vector-image-can-be-used-spa_120816-264914.jpg?w=1380",
      filename: "default-placeholder",
    };
  }

  // if location was changed, re‑geocode
  if (updatedData.location && updatedData.location !== originalLocation) {
    const geo = await geocodeLocation(updatedData.location);
    if (!geo) {
      req.flash(
        "error",
        ` Location "${updatedData.location}" could not be verified. Please enter a valid city.`
      );
      return res.redirect(`/listings/${id}/edit`);
    }
    listing.geometry = geo;
  }

  await listing.save();
  req.flash("success", "Your stay details have been updated successfully.");
  //flash msg
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "We couldn't find that stay.");
    return res.redirect("/listings");
  }
  // Delete image from Cloudinary if it exists and is not a default placeholder
  if (
    listing.image?.filename &&
    listing.image.filename !== "default-placeholder"
  ) {
    await cloudinary.uploader.destroy(listing.image.filename);
  }

  await Listing.findByIdAndDelete(id);
  //automatically all reviews are deleted from this listing as post middleware is defines in /model/listing.js
  req.flash("success", "The stay has been removed from WanderNest.");
  // Flash message
  res.redirect("/listings");
};

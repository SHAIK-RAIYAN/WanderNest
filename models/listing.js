const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    filename: String,
    url: {
      type: String,

      default:
        "https://img.freepik.com/premium-vector/no-photos-icon-vector-image-can-be-used-spa_120816-264914.jpg?w=1380",
      set: (v) =>
        v === ""
          ? "https://img.freepik.com/premium-vector/no-photos-icon-vector-image-can-be-used-spa_120816-264914.jpg?w=1380"
          : v,
    },
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String, // Always 'Point'
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
});

// Create 2dsphere index for geometry field
listingSchema.index({ geometry: '2dsphere' });

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

// const Review = require("./review");

// After deleting a listing, delete all associated reviews
listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

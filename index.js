//After Restructuring the project (express router)
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override"); //for patch and delete req
const ejsMate = require("ejs-mate"); //to include other ejs files in a ejs file
const ExpressError = require("./utils/ExpressError"); // error handling
const session = require("express-session"); //for establishing a session
const flash = require("connect-flash"); //to show a flash msg when work (like post) is done

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);

//express session
const sessionOptions = {
  secret: "secretCode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //from current time to 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, //to avoid cross-scripting attacks
  },
};
app.use(session(sessionOptions));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//routes
const listings = require("./routes/listing.js");
const review = require("./routes/review.js");

// mongoose connectioon
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/WanderNest";
main()
  .then((res) => {
    console.log("Connection succcessful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.listen(3000, () => {
  console.log(`WanderNest server running on http://localhost:${3000}`);
});

// root page
app.get("/", (req, res) => {
  res.send("root page !!!!!!!!");
  //   res.render("home");
});

// listings route
app.use("/listings", listings);
//reviews route
app.use("/listings/:id/reviews", review);

//keep this part at end
//errors Handling
app.all("{*splat}", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("listings/error.ejs", { status, message });
});
////////

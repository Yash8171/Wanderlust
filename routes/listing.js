const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, 
          upload.single("listing[image]"),
          validateListing,
          wrapAsync(listingController.createListing));

    

//New Route
router.get("/new",isLoggedIn, listingController.renderNewForm);

// Your Listings (owned by current user)
router.get("/my", isLoggedIn, async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user._id });
    if (listings.length === 0) {
      req.flash("warning", "You have not created any listing");
      return res.redirect("/listings");
    }
    res.render("listings/index", { listings });
  } catch (err) {
    req.flash("error", "Unable to fetch your listings.");
    res.redirect("/listings");
  }
});


router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing,
    wrapAsync(listingController.updateListing)
    )
    .delete(isLoggedIn, isOwner,
    wrapAsync(listingController.destroyListing)
);

//Edit Route
router.get("/:id/edit",
    isLoggedIn, isOwner,
    wrapAsync(listingController.renderEditForm)
);

router.get("/search-live", wrapAsync(async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);

  const regex = new RegExp(q, "i");
  const listings = await Listing.find({ title: regex }).limit(5);
  res.json(listings);
}));


module.exports = router;
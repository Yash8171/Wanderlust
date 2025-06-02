const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  try {
    const { q, minPrice, maxPrice, sort } = req.query;
    let filter = {};

    // Search by title or destination (adjust field as per your schema)
    if (q) {
      filter.title = new RegExp(q, 'i');
    }

    // Price filters
    if (minPrice) {
      filter.price = filter.price || {};
      filter.price.$gte = Number(minPrice);
    }
    if (maxPrice) {
      filter.price = filter.price || {};
      filter.price.$lte = Number(maxPrice);
    }

    // Sorting options
    let sortOption = {};
    if (sort === 'lowToHigh') {
  sortOption.price = 1;
} else if (sort === 'highToLow') {
  sortOption.price = -1;
}

    // Query DB with filters and sorting
    const listings = await Listing.find(filter).sort(sortOption);


    // If filtered but no results found, redirect with flash
    if ((q || minPrice || maxPrice) && listings.length === 0) {
      let messageParts = [];
      if (q) messageParts.push(`destination "${q}"`);
      if (minPrice) messageParts.push(`min price ₹${minPrice}`);
      if (maxPrice) messageParts.push(`max price ₹${maxPrice}`);

      const message = `No results found for ${messageParts.join(', ')}`;
      req.flash('warning', message);
      return res.redirect('/listings');
    }

    // Render listings page with data and current filters/sort values
    res.render('listings/index', {
      listings,
      searchQuery: q || '',
      minPrice: minPrice || '',
      maxPrice: maxPrice || '',
      sort: sort || '',
      flash: req.flash()
    });

  } catch (err) {
    console.error('Error fetching listings:', err);
    req.flash('danger', 'Something went wrong while fetching listings');
    res.redirect('/listings');
  }
};




module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing = async(req, res, next)=>{
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs",{listing, originalImageUrl});
};

module.exports.updateListing = async (req,res)=>{
    let {id}=req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req,res)=>{
    let {id}=req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};
const Listing = require("../models/listing");
module.exports.index = async(req,res)=>{
    let allListings = await Listing.find({});
    // console.log(allListings);
    res.render("listings/index.ejs",{allListings});
};

module.exports.newFormRender = (req,res)=>{
    // console.log(req.user);
    res.render("listings/new.ejs");
};

module.exports.createListing =  async (req,res,next)=>{
    // let listing = req.body.listing;
// if(!req.body.listing)
// {
//     throw new ExpressError(400,"Send Valid data for listing")
// }
// let result = listingSchema.validate(req.body);
// // console.log(result);
// if(result.error)
// {
//     throw new ExpressError(400,result.error);
// }
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url, "..",filename);
    const newListing = new Listing(req.body.listing)
    console.log(req.user);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success","New Listing Created")
    res.redirect("/listings");  
};

module.exports.editListing = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit",{listing});
};

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author",}}).populate("owner");
    console.log(listing);
    res.render("listings/show.ejs",{listing});
};

module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!=="undefined")
    {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }
    
    req.flash("success","Listing Updated!")
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted")
    res.redirect("/listings");
};
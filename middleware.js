const Listing = require("./models/listing");
const Review = require("./models/reviews");
const {listingSchema,reviewSchema} = require("./schema");
const ExpressError = require("./utils/ExpressError.js");
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated())
        {
            req.session.redirectUrl = req.originalUrl;
            // req.flash("error","you are not owner of the listing!");
            req.flash("error","you need to login before creating listings")
            return res.redirect("/login");
        }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl = req.session.redirectUrl;
        console.log("mid:",res.locals.redirectUrl);
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id)
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","you dont have permission to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error)
    {
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }   
    
}

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error)
    {
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }   
    
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId)
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
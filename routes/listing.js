const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })
// const ExpressError = require("../utils/ExpressError.js");
// const {listingSchema} = require("../schema");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controller/listings.js");
// const validateListing = (req,res,next)=>{
//     let {error} = listingSchema.validate(req.body);
//     if(error)
//     {
//         let errMsg = error.details.map((el)=>el.message).join(",");
//         throw new ExpressError(400,errMsg);
//     }else{
//         next();
//     }   
    
// }
//INDEX ROUTE

router.get("/new",isLoggedIn,listingController.newFormRender);

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));
// .post(upload.single('listing[image]'), function (req, res) {
//     res.send(req.file);
//   })
// router.get("/",wrapAsync(listingController.index))

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

//NEW ROUTE


//CREATE ROUTE
// router.post("/",validateListing,isLoggedIn,wrapAsync(listingController.createListing));

//EDIT ROUTE
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing));

//SHOW ROUTE
// router.get("/:id",wrapAsync(listingController.showListing));
//UPDATE ROUTE
// router.put("/:id",validateListing,isOwner,isLoggedIn,wrapAsync(listingController.updateListing));

//DELETE ROUTE

// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

module.exports = router;
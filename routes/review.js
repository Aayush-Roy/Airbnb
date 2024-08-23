const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/reviews");
const ExpressError = require("../utils/ExpressError");
// const {reviewSchema} = require("../schema.js");
const {validateReview,isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controller/reviews.js");

router.post("/listings/:id/reviews",isLoggedIn,validateReview,reviewController.createReview);

router.delete("/listings/:id/reviews/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;
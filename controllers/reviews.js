const campground = require('../models/campground');
const Review = require('../models/review')

module.exports.addReview = async (req, res) => {
    const campground01 = await campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground01.reviews.push(review);
    await review.save();
    await campground01.save();
    req.flash('success', 'Successfully added a new comment')
    res.redirect(`/campgrounds/${campground01._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    const reviewID = reviewId.trim(); 
    console.log(`"${id}", "${reviewID}"`)
    await campground.findByIdAndUpdate(id, { $pull: {reviews:reviewID} });
    await Review.findByIdAndDelete(reviewID);
    req.flash('success', 'Successfully deleted a comment')
    res.redirect(`/campgrounds/${id}`);
}
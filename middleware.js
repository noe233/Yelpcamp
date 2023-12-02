const campground = require("./models/campground");
const Review = require("./models/review");
const { campgroundSchema, reviewSchema  } = require('./scehmas.js');
const ExpressError = require('./utils/ExpressError');
module.exports.isLoggedIn = (req, res, next) => { 
    if (!req.isAuthenticated()) { 
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    console.log(req.body)
    if (error) {
        const msg = error.details.map(el=> el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => { 
    const { id } = req.params;
    const campground01 = await campground.findById(id);
    console.log(id)
    if (!campground01.author.equals(req.user._id)) { 
        req.flash('error', "You do not have permission to do that!");
        return res.redirect(`/campgrounds/${id}`)
       
    }
    next();
}
module.exports.isReviewAuthor = async (req, res, next) => { 
    const { id, reviewId } = req.params;
    console.log(`${req.params.reviewId}77777`);
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) { 
        req.flash('error', "You do not have permission to do that!");
        return res.redirect(`/campgrounds/${id}`)
       
    }
    next();
}
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.valid(req.body);
    if (error) {
        const msg = error.details.map(el=> el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}



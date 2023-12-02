const campground = require('../models/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken = process.env.mapbox_token;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });

module.exports.index = async (req, res) => {
    const campgrounds = await campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm =  (req, res) => {
    res.render('campgrounds/new') 
}

module.exports.createCampground = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.newCampground.location,
        limit: 1
    }).send();
    const campground01 = new campground(req.body.newCampground);
    campground01.geometry = geoData.body.features[0].geometry;
    campground01.image = {url:req.file.path, filename:req.file.filename};
    campground01.author = req.user._id;
    await campground01.save();
    console.log(campground01);
    req.flash('success', 'Successfully created a campground!') 
    res.redirect(`/campgrounds/${campground01._id}`) 
   
}

module.exports.showCampground =async (req, res) => {
    const campground01 =
        await campground.findById(req.params.id)
            .populate({
                path: "reviews",
                populate: {
                    path: 'author'
                }
            })
            .populate('author');
    
    if (!campground01) {
        req.flash('error', 'Cannot find that campground')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground01 })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground01 = await campground.findById(id)
    if (!campground01) { 
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground01 })
}

module.exports.updateCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground01 = await campground.findById(id)
    const img = {url:req.file.path, filename:req.file.filename};
    campground01.image = img;
    console.log(img)
    await campground01.save();
    
    req.flash('success', 'Successfully updated a campground!') 
    res.redirect(`/campgrounds/${campground01._id}`)
}

module.exports.makeCampground = async (req, res) => {
    const { id } = req.params;
    const campground01 = await campground.findByIdAndUpdate(id, { ...req.body.newCampground });
    req.flash('success', 'Successfully made a new campground')
    res.redirect(`/campgrounds/${campground01._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a campground')
    res.redirect('/campgrounds')
}
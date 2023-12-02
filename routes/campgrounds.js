const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware')
const campgrounds = require('../controllers/campgrounds')
const multer = require('multer')
const { storage } = require('../cloudinary/index')
const parser = multer({ storage: storage });

router.get('/', catchAsync(campgrounds.index))

router.route('/new')
    .get(isLoggedIn, campgrounds.renderNewForm)
    .post(isLoggedIn, parser.single('image'), catchAsync(campgrounds.createCampground))

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.makeCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

router.post('/:id/edit', isLoggedIn, isAuthor, parser.single('image'), validateCampground, catchAsync(campgrounds.updateCampground))



module.exports = router;
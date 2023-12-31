const { func } = require('joi')
const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema
const opts = { toJSON: { virtuals: true } };
const campgroundSchema = new Schema({
    title: String,
    price: Number,
    image: {
        type:{
            url: String,
            filename: String
        },
        required: false
    },
    description: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }, 
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
}, opts)

campgroundSchema.virtual('properties.popUpMarkUp').get(function () {
    return `
    <strong><a href = "/campgrounds/${this._id}"">${this.title}</a></strong>
    <p> ${this.description.substring(0, 20)} ... </p>`
})

campgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in:doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('campgrounds', campgroundSchema)
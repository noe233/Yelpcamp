const mongoose = require('mongoose')
const campground = require('../models/campground')
const { places, descriptors } = require('./seedHelpers')
mongoose.connect('mongodb://localhost:27017/yelpcamp');
const cities = require('./cities')
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', () => {
    console.log('database connected')
})

let sample = array => array[Math.floor(Math.random() * array.length)]
const seedDB = async () => {
    await campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const randomInt = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random()*20) + 10
        const camp = new campground({
            author:`639ba6bec8be80e55f010c6f`,
            location: `${cities[randomInt].city},${cities[randomInt].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: "Point",
                coordinates:[cities[randomInt].longitude, cities[randomInt].latitude]},
            image: {
                url: 'https://res.cloudinary.com/dfjva2clo/image/upload/v1673957672/YelpCamp/bpyctdrt1ieudlfi2opn.avif',
                filename: 'YelpCamp/bpyctdrt1ieudlfi2opn'
              },
            description:'Drive in, relax and enjoy campgrounds that offer car-based camping where you can park your car next to or near to your tent. ',
            price
        })
        await camp.save()
    }
             

}

seedDB().then(() => {
    mongoose.connection.close()
})
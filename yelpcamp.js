if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const express = require('express')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const app = express()
const path = require('path')//path模块提供了一些用于处理文件路径的小工具
const session = require('express-session')
const flash = require('connect-flash')
const ExpressError = require ('./utils/ExpressError')
const methodOverride = require('method-override')
const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const User = require('./models/user')
const secret = process.env.SECRET || 'thisisasecret';
const MongoStore = require("connect-mongo");

const dbUrl = process.env.DB_URL|| 'mongodb://127.0.0.1:27017/yelp-camp';;
console.log(process.env.DB_URL);
// 'mongodb://localhost:27017/yelpcamp'
/* mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    
    useUnifiedTopology: true
}); */

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });


const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', () => {
    console.log('database connected')
})
app.set('view engine', 'ejs')
app.engine('ejs', ejsMate)
app.set('views', path.join)
app.set('views', path.join(__dirname, 'views'))//连接路径
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static('public'))
const passport = require('passport')
const LocalStrtegy = require('passport-local')
/* app.configure(function() {
    app.use(express.cookieParser('keyboard cat'));
    app.use(express.session({ cookie: { maxAge: 60000 }}));
    app.use(flash());
  });
 */

//const dbUrl = 'mongodb://localhost:27017/yelpcamp';
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
            secret
        }
     });

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false, 
    saveUninitialized: true, 
}
app.use(session(sessionConfig)) 
app.use(flash())
app.use(passport.initialize()) 
app.use(passport.session())
passport.use(new LocalStrtegy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next()
})

app.set('etag', false)                 // tell the browser not to remember the old version of the page
app.use((req,res,next) => { 
    res.set('Cache-Control','no-store') //instrutor browser not to cache
    next()
})


/* app.get('/fakeUser', async(req,res) => {
    const user = new User({ email: '123@gmail.com', username: 'liu' });
    const newUser = await User.register(user, 'tequiero');
    res.send(newUser);
}) */

app.use ('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

app.get('/', (req, res) => {
    res.render('home')
})


app.all('*', (req, res, next) => {
    next (new ExpressError('page not found', 404))
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'something is wrong'
    res.status(statusCode).render('error', {err})
})
app.listen(8000, () => {
    console.log("serving on port 8000")
})
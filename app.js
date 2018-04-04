var express    = require('express'),
    bodyParser = require('body-parser'),
    mongoose   = require('mongoose'),
    app        = express(),
    Campground = require('./models/campground'),
    Comment    = require('./models/comment'),
    passport   = require('passport'),
    localStrategy = require('passport-local'),
    User        = require('./models/user'),
    seedDB     = require('./seeds'),
    methodOverride = require('method-override')
    
    // requiring routes
var commentRoutes = require("./routes/comments"),
    campgroundsRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index")

// Passport Configuration
app.use(require("express-session")({
    secret: "rockos modern life",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});




// seedDB();
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundsRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log('YelpCamp Server has started!');
});
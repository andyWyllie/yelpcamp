var express    = require('express'),
    bodyParser = require('body-parser'),
    mongoose   = require('mongoose'),
    app        = express(),
    Campground = require('./models/campground'),
    Comment    = require('./models/comment'),
    passport   = require('passport'),
    localStrategy = require('passport-local'),
    User        = require('./models/user'),
    seedDB     = require('./seeds');

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




seedDB();
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.get('/', function(req, res){
    res.render('landing');
});

// INDEX ROUTE
app.get('/campgrounds', function(req, res){
    // get all campgrounds from database
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err)
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user})
        }
    });
});

// NEW ROUTE
app.get('/campgrounds/new', isLoggedIn, function(req, res){
   res.render('campgrounds/new') ;
});

// CREATE ROUTE
app.post('/campgrounds', isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image =req.body.image;
    var description = req.body.desc;
    var newCampground = {name: name, image: image, description: description};
    // Create and add newCampground to campgrounds database
    Campground.create(newCampground, function(err, newCreate){
        if(err){
            console.log('campground not created');
        } else{
            res.redirect('/campgrounds')
        }
    });
});

// SHOW ROUTE
app.get('/campgrounds/:id', function(req, res){
    // find campground with correlating id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
    // render show page that shows campground details
    res.render('campgrounds/show', {campground: foundCampground});
        }
    });

});

// EDIT ROUTE
// app.get('/campgrounds/:id/edit', function(req, res){});
// UPDATE ROUTE
// app.put('/campgrounds/:id', function(req, res){});
// DESTROY ROUTE
// app.delete('/campgrounds/:id');

// ========
// comments routes
// ========
// NEW COMMENT ROUTE
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    // find Id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});


// CREATE COMMENT ROUTE
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    // lookup by ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            })
        }    
    });
});


// AUTH ROUTES
// show register form
app.get("/register", function(req, res) {
    res.render("register");
});
// handle sign up logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
        console.log(err);    
        return  res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});
// show login form
app.get("/login", function(req, res){
    res.render("login");
});
// handle login logic
app.post("/login", passport.authenticate("local", 
{
    successRedirect: "/campgrounds", 
    failureRedirect: "/login"
    
}), function(req, res){
    
});
// logout route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

// middlewares
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen(process.env.PORT, process.env.IP, function(){
    console.log('YelpCamp Server has started!');
});
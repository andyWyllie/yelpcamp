var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware');

// INDEX ROUTE
router.get('/', function(req, res){
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
router.get('/new', middleware.isLoggedIn, function(req, res){
   res.render('campgrounds/new') ;
});

// CREATE ROUTE
router.post('/', middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image =req.body.image;
    var description = req.body.desc;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: description, author: author};
    // Create and add newCampground to campgrounds database
    Campground.create(newCampground, function(err, newCreate){
        if(err){
            console.log('campground not created');
        } else{
            req.flash('success', "Campground created!");
            res.redirect('/campgrounds');
        }
    });
});

// SHOW ROUTE
router.get('/:id', function(req, res){
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
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render('campgrounds/edit', {campground: foundCampground});
    });
});

// UPDATE ROUTE
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    })
});
// DESTROY ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;
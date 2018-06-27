var express = require("express"),
    router = express.Router(),
    middleware = require("../middleware"),
    Campground = require("../models/campground");

//=======================================
//          Campground routes
//=======================================

//Index -- Show all campgrounds
router.get('/', function(req, res){
    //get all campgrounds from DB
    Campground.find({},function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/YelpIndex",{campgrounds:allCampgrounds});
        }
    });
});

//NEW -- show form to create new campground
router.get('/new', middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/newCampground");
});

//SHOW -- Shows full info about one campground
router.get('/:id', function(req, res){
    var id = req.params.id;
    //get all campgrounds from DB
    Campground.findById(id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            res.render("campgrounds/showCampground",{campground:foundCampground});
        }
    });
});

//Create -- add new campground to database
router.post('/', middleware.isLoggedIn, function(req, res){
    //get data from form and add to campgrounds
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name:req.body.name,img:req.body.img,description:req.body.description,price:req.body.price, author:author};
    //create a new campground and save to database
    Campground.create(newCampground, function(err, newCamp){
        if(err){
           console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//EDIT campground route
router.get("/:id/edit", middleware.isAuthorizedCampground, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground:foundCampground});
    });
});

//UPDATE campground route
router.put("/:id", middleware.isAuthorizedCampground, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");   
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY campground route
router.delete("/:id", middleware.isAuthorizedCampground, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
});

module.exports = router;